# Media Monitoring API

Backend API sederhana untuk platform **media monitoring** yang digunakan untuk menerima, mencari, dan membuat statistik dari data mentions seperti artikel berita dan social posts.

Project ini dibuat sebagai bagian dari technical assessment dengan fokus pada:

* Bulk ingestion mentions
* Idempotent ingestion
* Duplicate handling
* Search mentions
* Statistics untuk dashboard
* PostgreSQL database
* Migration-based schema
* REST API menggunakan Express.js dan TypeScript

---

## Tech Stack

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* `pg`
* Nodemon
* SQL Migration

---

## Project Structure

```text
src/
├── config/
│   ├── config.ts
│   └── database.ts
│
├── controllers/
│   ├── mention.controller.ts
│   └── stats.controller.ts
│
├── middleware/
│   └── validate-mention.middleware.ts
│
├── routes/
│   └── mention.routes.ts
│
├── services/
│   └── mention.service.ts
│
├── types/
│   ├── mention.ts
│   └── pagination.ts
│
├── app.ts
└── server.ts
database/
└── migrations
    └── create_mentions.sql
scripts/
└── migrate.ts


.env.example
package.json
tsconfig.json
```

### Responsibility

#### Controller

Controller menangani HTTP request dan response.

Contohnya:

```text
Request
   ↓
Controller
   ↓
Validation
   ↓
Service
   ↓
Response
```

Controller tidak menangani query database secara langsung.

#### Service

Service menangani business logic seperti:

* Bulk ingestion
* Duplicate handling
* Search
* Statistics

#### Middleware

Middleware digunakan untuk melakukan validasi request sebelum request diteruskan ke controller.

#### Database

PostgreSQL digunakan untuk menyimpan mentions.

Schema dibuat menggunakan migration SQL dan bukan secara manual melalui GUI.

---

# Getting Started

## 1. Clone Repository

```bash
git clone <repository-url>
cd technical-test-media-monitoring
```

## 2. Install Dependencies

Menggunakan npm:

```bash
npm install
```

atau menggunakan pnpm:

```bash
pnpm install
```

---

## 3. Setup PostgreSQL

Pastikan PostgreSQL sudah terinstall dan sedang berjalan.

Buat database:

```sql
CREATE DATABASE media_monitoring;
```

---

## 4. Environment Variables

Buat file `.env` berdasarkan `.env.example`.

Contoh:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=media_monitoring
DB_USER=postgres
DB_PASSWORD=your_password
```

Sesuaikan value dengan konfigurasi PostgreSQL lokal.

---

# Database Migration

Schema database dibuat menggunakan SQL migration.

Migration dapat dijalankan menggunakan migration script yang tersedia pada project.

Contoh:

```bash
npm run migrate
```

Migration digunakan agar perubahan schema database:

* dapat dilacak
* dapat di-version control
* dapat direplikasi di environment lain
* tidak bergantung pada perubahan manual melalui database GUI

---

# Running the Application

## Development

```bash
npm run dev
```

Server akan berjalan pada:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

---

# API Endpoints

## 1. Bulk Ingest Mentions

### Endpoint

```http
POST /internal/mentions/bulk
```

Endpoint ini digunakan untuk menerima beberapa mentions sekaligus.

### Request

```json
[
  {
    "external_id": "str-99120",
    "source": "The Star",
    "title": "Ringgit strengthens against US dollar in early trade",
    "content": "<p>The ringgit opened higher against the greenback.</p>",
    "url": "https://example.com/article",
    "published_at": "2026-08-11T14:02:33+08:00"
  }
]
```

### Successful Response

```json
{
  "success": true,
  "message": "Mentions processed successfully",
  "data": {
    "summary": {
      "received": 1,
      "inserted": 1,
      "duplicates": 0
    },
    "inserted": [
      {
        "external_id": "str-99120"
      }
    ]
  }
}
```

---

# Idempotency and Duplicate Handling

Bulk ingestion harus bersifat **idempotent**.

Artinya, request yang sama dikirim lebih dari satu kali tidak boleh membuat duplicate records.

Identitas mention ditentukan menggunakan `external_id` sesuai dengan source data.

Database menggunakan unique constraint/index untuk mencegah duplicate insertion.

Contoh:

```text
Request 1
external_id = str-99120
        ↓
INSERT
        ↓
Inserted

Request 2
external_id = str-99120
        ↓
Duplicate
        ↓
Ignored
```

Response akan memberikan jumlah data yang diterima, berhasil dimasukkan, dan duplicate.

```json
{
  "summary": {
    "received": 10,
    "inserted": 7,
    "duplicates": 3
  }
}
```

Pendekatan ini membuat endpoint aman ketika ingestion worker melakukan retry.

---

# 2. Search Mentions

### Endpoint

```http
GET /mentions
```

Search mendukung parameter pencarian dan pagination sesuai implementasi endpoint.

Contoh:

```http
GET /mentions?query=ringgit&page=1&limit=10
```

### Pagination

Parameter:

| Parameter | Description                | Default |
| --------- | -------------------------- | ------: |
| `page`    | Page number                |     `1` |
| `limit`   | Number of records per page |    `10` |

Maximum `limit`:

```text
100
```

### Example Response

```json
{
  "success": true,
  "message": "Mentions retrieved successfully",
  "data": [
    {
      "external_id": "str-99120",
      "source": "The Star",
      "title": "Ringgit strengthens against US dollar in early trade",
      "content": "<p>The ringgit opened higher.</p>",
      "url": "https://example.com/article",
      "published_at": "2026-08-11T14:02:33+08:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPage": 1
  }
}
```

Invalid pagination parameters menghasilkan:

```http
400 Bad Request
```

Contoh:

```text
?page=abc
?limit=0
?limit=101
```

---

# 3. Mention Statistics

Statistics digunakan untuk menyediakan data yang dapat digunakan oleh dashboard chart.

## Group by Source

```http
GET /mentions/stats?group_by=source
```

Endpoint menghitung jumlah mentions berdasarkan source.

Example:

```json
{
  "success": true,
  "message": "Mention stats retrieved successfully",
  "data": [
    {
      "label": "The Star",
      "count": 25
    },
    {
      "label": "Bernama",
      "count": 18
    }
  ]
}
```

---

## Group by Day

```http
GET /mentions/stats?group_by=day
```

Untuk statistik harian, tanggal diambil dari:

```text
published_at
```

bukan waktu data dimasukkan ke database.

Contoh data:

```json
{
  "published_at": "2026-08-11T14:02:33+08:00"
}
```

akan dikelompokkan menjadi:

```text
2026-08-11
```

Example response:

```json
{
  "success": true,
  "message": "Mention stats retrieved successfully",
  "data": [
    {
      "label": "2026-08-11",
      "count": 12
    },
    {
      "label": "2026-08-12",
      "count": 18
    }
  ]
}
```

Data tersebut dapat langsung digunakan untuk membuat line chart atau bar chart pada dashboard.

---

# Error Handling

API menggunakan status code HTTP untuk membedakan jenis response.

## 200 — Success

Request berhasil.

```json
{
  "success": true,
  "message": "Mentions retrieved successfully"
}
```

## 400 — Bad Request

Request dari client tidak valid.

Contoh:

```json
{
  "success": false,
  "message": "group_by must be either source or day"
}
```

## 500 — Internal Server Error

Terjadi error pada server atau database.

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

# Validation

Request ingestion divalidasi menggunakan middleware sebelum diproses oleh controller.

Flow:

```text
POST /internal/mentions/bulk
            ↓
validateBulkMention
            ↓
      Valid request?
       ↙        ↘
     No          Yes
     ↓             ↓
    400        Controller
                  ↓
                Service
                  ↓
               Database
```

Hal ini mencegah data invalid masuk ke business logic dan database.

---

# How I Solved the Duplicate Ingestion Problem

Salah satu requirement penting adalah endpoint ingestion harus idempotent.

Masalah yang perlu dihindari:

```text
Client
  ↓
POST mentions
  ↓
Database INSERT
  ↓
Network timeout
  ↓
Client melakukan retry
  ↓
Database INSERT lagi
```

Tanpa unique constraint, data yang sama dapat tersimpan dua kali.

Solusi yang digunakan:

1. `external_id` digunakan sebagai identifier dari mention.
2. Database memberikan unique constraint.
3. Insert menggunakan conflict handling.
4. Duplicate tidak membuat request gagal.
5. Response mengembalikan jumlah duplicate.

Dengan demikian retry dari client tidak menghasilkan duplicate data.

---

# Testing

Endpoint dapat diuji menggunakan Postman, Insomnia, curl, atau REST client lainnya.

Contoh menggunakan curl:

### Bulk ingest

```bash
curl -X POST http://localhost:3000/internal/mentions/bulk \
  -H "Content-Type: application/json" \
  -d '[
    {
      "external_id": "str-99120",
      "source": "The Star",
      "title": "Ringgit strengthens against US dollar",
      "content": "<p>The ringgit opened higher.</p>",
      "url": "https://example.com/article",
      "published_at": "2026-08-11T14:02:33+08:00"
    }
  ]'
```

### Search

```bash
curl "http://localhost:3000/mentions?query=ringgit&page=1&limit=10"
```

### Stats by source

```bash
curl "http://localhost:3000/mentions/stats?group_by=source"
```

### Stats by day

```bash
curl "http://localhost:3000/mentions/stats?group_by=day"
```

---