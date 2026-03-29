import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import prisma from "./config/prisma.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());


// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Routes
app.use("/auth", authRoutes);



export default app;