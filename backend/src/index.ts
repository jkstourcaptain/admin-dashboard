import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Admin Routes
import adminAuthRoutes from "./routes/adminAuth";
import dashboardRoutes from "./routes/dashboard";
import productRoutes from "./routes/products";
import purchaseRoutes from "./routes/purchases";
import receiptRoutes from "./routes/receipts";

// App Routes
import appUserRoutes from "./routes/appUsers";
import appContentRoutes from "./routes/appContent";
import appSupportRoutes from "./routes/appSupport";

// Database connection
import "./config/database";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0'; // 외부 접속 허용

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});

// Security middleware
app.use(helmet());
const getAllowedOrigins = () => {
  const baseOrigins = [
    "http://localhost:3000",
    "http://localhost:3002", 
    "http://localhost:5173", 
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176"
  ];
  
  const externalIP = process.env.EXTERNAL_IP || "192.168.0.126";
  const externalOrigins = [
    `http://${externalIP}:3000`,
    `http://${externalIP}:3002`,
    `http://${externalIP}:5173`,
    `http://${externalIP}:5174`,
    `http://${externalIP}:5175`,
    `http://${externalIP}:5176`
  ];
  
  return [...baseOrigins, ...externalOrigins];
};

app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
}));

app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Admin API Routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/purchases", purchaseRoutes);
app.use("/api/admin/receipts", receiptRoutes);

// App API Routes
app.use("/api/app/users", appUserRoutes);
app.use("/api/app/content", appContentRoutes);
app.use("/api/app/support", appSupportRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Admin Dashboard API",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 Admin Dashboard API Server is running on ${HOST}:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 External access: http://192.168.0.126:${PORT}/health`);
});
