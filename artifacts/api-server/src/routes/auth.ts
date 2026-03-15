import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword, signToken, requireAuth } from "../lib/auth";
import { SignupBody, LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

const isHttps = !!process.env.REPL_ID || process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: (isHttps ? "none" : "lax") as "none" | "lax",
  secure: isHttps,
};

router.post("/signup", async (req, res) => {
  try {
    const parsed = SignupBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation error", message: "Invalid input" });
      return;
    }
    const { name, email, password } = parsed.data;

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "Conflict", message: "Email already exists" });
      return;
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(usersTable).values({ name, email, passwordHash }).returning();

    const token = signToken({ userId: user.id, email: user.email });
    res.cookie("pulsebeat_token", token, cookieOptions);

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
      message: "Account created successfully"
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error", message: "Failed to create account" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const parsed = LoginBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation error", message: "Invalid input" });
      return;
    }
    const { email, password } = parsed.data;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid email or password" });
      return;
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Unauthorized", message: "Invalid email or password" });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email });
    res.cookie("pulsebeat_token", token, cookieOptions);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
      message: "Login successful"
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error", message: "Failed to login" });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("pulsebeat_token", { sameSite: isProd ? "none" : "lax", secure: isProd });
  res.json({ message: "Logged out successfully" });
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const [dbUser] = await db.select().from(usersTable).where(eq(usersTable.id, user.userId)).limit(1);
    if (!dbUser) {
      res.status(401).json({ error: "Unauthorized", message: "User not found" });
      return;
    }
    res.json({ id: dbUser.id, name: dbUser.name, email: dbUser.email, createdAt: dbUser.createdAt });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Server error", message: "Failed to get user" });
  }
});

export default router;
