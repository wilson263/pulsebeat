import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";

const app: Express = express();

const isProd = process.env.NODE_ENV === "production";
const frontendUrl = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: isProd && frontendUrl ? frontendUrl : true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);

export default app;
