import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthenticatedRequest extends Request {
  adminUserId?: number;
  adminRole?: string;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      adminUserId: number;
      adminRole: string;
    };
    req.adminUserId = decoded.adminUserId;
    req.adminRole = decoded.adminRole;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.adminRole || !roles.includes(req.adminRole)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

export const generateToken = (
  adminUserId: number,
  adminRole: string
): string => {
  return jwt.sign({ adminUserId, adminRole }, JWT_SECRET, { expiresIn: "24h" });
};
