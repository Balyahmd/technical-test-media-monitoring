import { Router } from "express";
import { bulkIngest, search } from "../controllers/mention.controller.ts";
import { validateBulkMention } from "../middleware/validate-mention.middleware.ts";
import { stats } from "../controllers/stats.controller.ts";

const router = Router();

router.post("/internal/mentions/bulk", validateBulkMention, bulkIngest);
router.get("/mentions", search);
router.get("/mentions/stats", stats);

export default router;
