// backend\src\server.ts
/* eslint-disable no-console */
import { app } from "./app";
import { consts } from "./config/constants";
import { connectMongo } from "./config/mongo";

const main = async () => {
  if (!consts.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  await connectMongo(consts.env.MONGO_URI);

  app.listen(consts.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${consts.env.PORT}`);
    console.log(`📚 Swagger at http://localhost:${consts.env.PORT}/api-docs`);
  });
}

main().catch((err) => {
  console.error("❌ Fatal startup error:", err);
  process.exit(1);
});
