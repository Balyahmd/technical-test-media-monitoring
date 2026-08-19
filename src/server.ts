import app from "./app.ts"
import { env } from "./config/env.ts";
import { connectDatabase } from "./config/database.ts";

const PORT = env.port;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
