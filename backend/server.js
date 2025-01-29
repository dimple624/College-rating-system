const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const College = require("./models/College");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "secret_key"; // Use environment variable for secret key

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/studentRating")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Serve static files (for frontend)
app.use(express.static(path.join(__dirname, "../frontend")));

// Default route to serve index.html (home page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Add a search route to find colleges by name
app.get("/colleges", async (req, res) => {
  const { name } = req.query;
  try {
    let colleges;
    if (name) {
      // Search for a specific college by name
      colleges = await College.find({ collegeName: { $regex: name, $options: "i" } });
    } else {
      // Fetch all colleges
      colleges = await College.find();
    }
    res.status(200).json(colleges);
  } catch (err) {
    console.error("Error fetching colleges:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Register User
app.post("/signup", async (req, res) => {
  const { collegeId, name, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ success: false, message: "Username already taken." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      collegeId,
      name,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({ success: true, message: "User registered successfully." });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Login User
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ success: false, message: "Invalid username." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password." });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];  // Bearer token
  if (!token) return res.status(401).json({ success: false, message: "Token is required." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);  // Verify the token using JWT_SECRET
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}

// Submit Rating
app.post("/rate", verifyToken, async (req, res) => {
  const { collegeName, ratings, review } = req.body;

  if (!collegeName || !ratings || Object.keys(ratings).length === 0) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ success: false, message: "User not found." });

    // Check if the college already exists
    let college = await College.findOne({ collegeName });
    if (!college) {
      // If college doesn't exist, create a new one with the rating
      college = new College({
        collegeName: collegeName,
        ratings: [{ username: user.username, ratings, review }]
      });
      await college.save();
      return res.status(200).json({ success: true, message: "Rating added successfully." });
    }

    // Add the rating to an existing college
    college.ratings.push({ username: user.username, ratings, review });
    await college.save();
    res.status(200).json({ success: true, message: "Rating added successfully." });
  } catch (err) {
    console.error("Error submitting rating:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Get All Colleges and Their Ratings
app.get("/colleges", async (req, res) => {
  try {
    const colleges = await College.find();
    res.status(200).json(colleges);
  } catch (err) {
    console.error("Error fetching colleges:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Listen on specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
