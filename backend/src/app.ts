import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import path from "path";
import gradeRoutes from "./routes/grade.routes";

export const app = express();

console.log("=== APP START ===");

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST"],
}));

app.use(express.json({ limit: "1mb" }));

app.get("/api/ping", (_req: Request, res: Response) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.get("/health", (_req, res) => {
  res.send("ok");
});

app.use("/api/grade", gradeRoutes);
console.log("Registered /api/grade routes");

const publicPath = path.join(__dirname, '../dist');
app.use(express.static(publicPath));

//αυτο είναι για να σερβίρει το index.html του front όταν ο χρήστης επισκέπτεται το root path ή οποιοδήποτε άλλο path που δεν είναι api ή api-docs
app.get(/^\/(?!api|api-docs).*/, (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

export default app;
