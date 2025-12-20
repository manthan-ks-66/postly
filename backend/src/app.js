import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// middlewares
app.use(express.json({ limit: "50kb" }));
// encode the url that has symbols and special charecters like %_ @#
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (_, res) => {
  res.status(200).json({
    statusCode: 200,
    message: "OK",
    status: "success",
  });
});

export default app;
