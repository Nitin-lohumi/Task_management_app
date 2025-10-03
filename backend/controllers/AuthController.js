import UserData from "../model/userModal.js";
import jwt from "jsonwebtoken";
export const verifySignup = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ message: "some thing is not filled." });
    }
    const newUser = new UserData({ name, email, password });
    await newUser.save();
    return res.status(200).json({ message: "singup  successful", user: userPayload });
};

export const verifyLogin = async (req, res) => {
    const { email, password } = req.body;
    if (
        !password ||
        !email
    ) {
        return res.status(400).json({ message: "invalid user Crediential." });
    }
    const user = await UserData.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const userPayload = {
        id: user._id,
        email: user.email,
        name: user.name,
    };
    const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Login successful ", user: userPayload });
};
