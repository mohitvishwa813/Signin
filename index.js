const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://127.0.0.1:5500", // Change this to your frontend's origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("App startup error:", err);
  });

// Import User model
const User = require("./models/User"); // Make sure to create this model

// User signup
app.post("/api/users", async (req, res) => {
  const { email, password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
});

// User login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const matchedPassword = await bcrypt.compare(password, user.password);
      if (matchedPassword) {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Set the cookie with the token
        res.cookie("setCookietoken", token, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000, // 1 hour
          secure: false, // Set to true if using HTTPS
          sameSite: "strict",
        });

        res.json({ message: "User authenticated successfully", user });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } else {
      res.status(401).json({ message: "Invalid email" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error authenticating user", error });
  }
});

// Middleware for token authentication
const authenticateToken = (req, res, next) => {
  const token = req.cookies.setCookietoken; // Use cookies to get the token

  if (!token) {
    return res.sendStatus(401);
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Protected route example
app.get("/api/home", authenticateToken, (req, res) => {
  res.json({ message: "Welcome to home page", user: req.user });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
