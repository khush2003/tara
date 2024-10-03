import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model"; // Adjust the path if necessary
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import verify from "./verifyToken";

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload | string;
}

dotenv.config();

const router = express.Router();

// Register a new Student
router.post("/registerStudent", async (req: Request, res: Response) => {
    const { name, email, password, profile_picture } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: "student",
            profile_picture: profile_picture
                ? profile_picture
                : "https://via.placeholder.com/150",
            student_details: {
                game_points: 0,
                game_hours_left: 60,
            },
        });
        await newUser.save();
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: "Server error" });
        }

        const token = jwt.sign({ _id: newUser._id }, JWT_SECRET);

        res.header("auth-token", token).status(201).json({
            message: "Register successful",
            token,
            user_id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message:
                "Some error with the provided user details or something wrong with the server",
        });
    }
});

// Login user
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({
                    message: "User does not exist! Please register first!",
                });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Create a JWT token
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: "Server error" });
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET);

        res.header("auth-token", token).json({
            message: "Login successful",
            token,
            user_id: user._id, // Include username in response
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get user logged in status
router.get("/me", verify, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.findById((req.user as JwtPayload)._id);
        res.status(200).json({
            response: "success",
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            role: user?.role,
            profile_picture: user?.profile_picture,
        });
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
});

// Get user profile
router.get(
    "/profile",
    verify,
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const user = await User.findById((req.user as JwtPayload)._id);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

// Update user profile
router.put("/me", verify, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, email, profile_picture } = req.body;
        // Validate the request
        if (!name || !email) {
            return res
                .status(400)
                .json({ message: "Name and email are required" });
        }

        const user = await User.findByIdAndUpdate(
            (req.user as JwtPayload)._id,
            req.body,
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update user password
router.put(
    "/me/updatePassword",
    verify,
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const { oldPassword, password } = req.body;
            // Validate the request
            if (!oldPassword || !password) {
                return res
                    .status(400)
                    .json({
                        message: "Old password and new password are required",
                    });
            }

            const user = await User.findById((req.user as JwtPayload)._id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check password
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid password" });
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user.password = hashedPassword;
            await user.save();
            res.json({ message: "Password updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

// Register a new Teacher
router.post("/registerTeacher", async (req: Request, res: Response) => {
    const { name, email, password, profile_picture, school } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: "teacher",
            profile_picture: profile_picture
                ? profile_picture
                : "https://via.placeholder.com/150",
            teacher_details: {
                school: school,
                classrooms: [],
            },
        });
        await newUser.save();
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: "Server error" });
        }

        const token = jwt.sign({ _id: newUser._id }, JWT_SECRET);

        res.header("auth-token", token).status(201).json({
            message: "Register successful",
            token,
            user_id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message:
                "Some error with the provided user details or something wrong with the server",
        });
    }
});

export default router;
