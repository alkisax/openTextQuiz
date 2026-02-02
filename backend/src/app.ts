import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import path from "path";
// import gradeRoutes from "./routes/grade.routes";

export const app = express();

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

// app.use("/api/grade", gradeRoutes);

app.use(express.static("dist"));

// ✅ SERVE UPLOADS BEFORE DIST
// ΠΡΟΣΟΧΗ το ../ στο path είναι συμαντικο. τα αρχεια μας βρίσκονται τελικά στον φάκελο dist
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

//αυτο είναι για να σερβίρει το index.html του front όταν ο χρήστης επισκέπτεται το root path ή οποιοδήποτε άλλο path που δεν είναι api ή api-docs
app.get(/^\/(?!api|api-docs).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

export default app;
