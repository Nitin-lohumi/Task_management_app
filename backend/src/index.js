import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "../DB/Db.js";
import authRoutes from "../routes/authRoute.js";
import noteRoutes from "../routes/noteRoutes.js";
import verifyToken from "../middleware/AuthMiddleWare.js";
dotenv.config();
const app = express();

app.use(cors({
    origin: ["https://task-management-app-cyan-one.vercel.app","http://localhost:5173"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1);

connectDB();

app.use("/api/auth", authRoutes);

app.use(verifyToken);

app.use("/api", noteRoutes);

app.get("/auth/check", (req, res) => {
    return res.json({ isLoggedIn: "true", user: req.user });
});

app.get("/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ msg: "sucessfull logout" });
});

app.get("/", (req, res) => {
    res.json({ msg: "Safe route" });
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
