const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenUtils");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed
        });

        res.json({ message: "User registered", user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

 
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid email or password" });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.json({
            message: "Login successful",
            accessToken,
            refreshToken
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

 
exports.refreshToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) return res.status(401).json({ message: "Refresh token missing" });

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token" });

            // generate new access token
            const newAccessToken = generateAccessToken(payload.id);

            res.json({
                accessToken: newAccessToken
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};
