import app from "./app.ts"
import { configEnv } from "./config/config.ts";
import { connectDatabase } from "./config/database.ts";

const PORT = configEnv.port;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
