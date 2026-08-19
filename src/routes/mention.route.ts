import { Router } from "express";
import { bulkIngest } from "../controllers/mention.controller.ts";
import { validateBulkMention } from "../middleware/validate-mention.middleware.ts";

const router = Router();

router.post("/internal/mentions/bulk", validateBulkMention, bulkIngest);

export default router;
