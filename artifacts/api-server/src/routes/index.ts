import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import scanRouter from "./scan";
import musicRouter from "./music";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/scan", scanRouter);
router.use("/music", musicRouter);
router.use("/dashboard", dashboardRouter);

export default router;
