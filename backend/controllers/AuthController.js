import UserData from "../model/userModal.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const verifySignup = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ message: "some thing is not filled." });
    }
    const IsUserExit = await UserData.find({ email });
    if (IsUserExit.length) {
        return res.status(200).json({ message: "user is already exist", IsUserExit });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new UserData({ name, email, password: hashPassword });
    await newUser.save();
    return res.status(200).json({ message: "singup  successful", user: newUser });
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
    const isPasss = await bcrypt.compare(password, user.password);
    if (!isPasss) {
        return res.status(301).json({ msg: "wrong password" });
    }
    const userPayload = {
        id: user._id,
        email: user.email,
        name: user.name
    };
    const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Login successful ", user: userPayload });
};
