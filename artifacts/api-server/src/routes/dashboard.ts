import { Router, type IRouter, Request, Response } from "express";
import { requireAuth } from "../lib/auth";
import { db, scansTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user.userId;

    const allScans = await db.select().from(scansTable)
      .where(eq(scansTable.userId, userId))
      .orderBy(desc(scansTable.createdAt));

    const totalScans = allScans.length;

    const averageHeartRate = totalScans > 0
      ? allScans.reduce((sum, s) => sum + s.heartRate, 0) / totalScans
      : 0;

    const averageRespiratoryRate = totalScans > 0
      ? allScans.reduce((sum, s) => sum + s.respiratoryRate, 0) / totalScans
      : 0;

    const moodDistribution: Record<string, number> = {};
    for (const scan of allScans) {
      moodDistribution[scan.mood] = (moodDistribution[scan.mood] || 0) + 1;
    }

    const recentScans = allScans.slice(0, 10).map(s => ({
      id: s.id,
      heartRate: s.heartRate,
      respiratoryRate: s.respiratoryRate,
      hrvSdnn: s.hrvSdnn,
      mood: s.mood,
      confidence: s.confidence,
      createdAt: s.createdAt
    }));

    const heartRateTrend = allScans.slice(0, 14).reverse().map(s => ({
      date: new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      heartRate: Math.round(s.heartRate)
    }));

    res.json({
      totalScans,
      averageHeartRate: Math.round(averageHeartRate * 10) / 10,
      averageRespiratoryRate: Math.round(averageRespiratoryRate * 10) / 10,
      moodDistribution,
      recentScans,
      heartRateTrend
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Server error", message: "Failed to fetch dashboard stats" });
  }
});

export default router;
