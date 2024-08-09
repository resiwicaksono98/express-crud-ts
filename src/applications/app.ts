import express from "express";
import { publicRouter } from "../routes/publicApi";
import { errorMiddleware } from "../middleware/errorMiddleware";
import { apiRouter } from "../routes/api";

export const app = express();
app.use(express.json());

app.use(publicRouter);
app.use(apiRouter);
app.use(errorMiddleware)
