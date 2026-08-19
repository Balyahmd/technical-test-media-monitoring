import express, { type Express, type Request, type Response } from "express";
import mentionRouter from "./routes/mention.route.ts"

const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use(mentionRouter)

export default app;