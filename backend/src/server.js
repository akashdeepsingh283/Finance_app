import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = Number(process.env.PORT) || 5001;

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`Finance API listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Unable to start the API:", error.message);
  process.exit(1);
});
