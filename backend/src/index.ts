import express from "express";
import cors from "cors";
import multer from "multer";
import { authenticate } from "./middleware/auth";
import documentsRouter from "./routes/documents";
import shipmentsRouter from "./routes/shipments";
import extractionsRouter from "./routes/extractions";
import validationsRouter from "./routes/validations";
import webhooksRouter from "./routes/webhooks";
import apiKeysRouter from "./routes/api-keys";

const app = express();
const PORT = parseInt(process.env.PORT || "4000");

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Health check (no auth required)
app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: "0.1.0", service: "dockflow-api" });
});

// ─── API Routes (all require authentication) ───────────────────────────────
app.use("/api/documents", authenticate, documentsRouter);
app.use("/api/shipments", authenticate, shipmentsRouter);
app.use("/api", authenticate, extractionsRouter);
app.use("/api/validations", authenticate, validationsRouter);
app.use("/api/webhooks", authenticate, webhooksRouter);
app.use("/api/keys", authenticate, apiKeysRouter);

// ─── Multer Error Handler ──────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ error: "File too large. Maximum size is 50MB." });
      return;
    }
    res.status(400).json({ error: `Upload error: ${err.message}` });
    return;
  }

  if (err.message?.startsWith("Unsupported file type")) {
    res.status(400).json({ error: err.message });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ─── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚢 DockFlow API running on http://0.0.0.0:${PORT}`);
  console.log(`   Health: http://0.0.0.0:${PORT}/health`);
});

export default app;