export const normalizePublishedAt = (
    value: string | number | null,
): Date | null => {
    if (value === null) {
        return null;
    }

    if (typeof value === "number") {
        const date = new Date(value * 1000);

        if (Number.isNaN(date.getTime())) {
            throw new Error("Invalid published_at value");
        }

        return date;
    }

    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
        return null;
    }

    const dateMatch =
        /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(
            normalizedValue,
        );

    if (dateMatch !== null) {
        const [, day, month, year] = dateMatch;

        const date = new Date(
            `${year}-${month}-${day}T00:00:00Z`,
        );

        if (Number.isNaN(date.getTime())) {
            throw new Error("Invalid published_at value");
        }

        return date;
    }

    const date = new Date(normalizedValue);
    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid published_at value");
    }

    return date;
};

