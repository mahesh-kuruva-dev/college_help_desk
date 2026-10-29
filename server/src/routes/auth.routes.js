
import { Router } from "express";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

let clientPromise;

async function getUsersCollection() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    clientPromise = client.connect().catch((error) => {
      clientPromise = null;
      throw error;
    });
  }

  const client = await clientPromise;
  return client.db("edureach_db").collection("users");
}

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function setAuthCookie(res, token) {
  const production = process.env.NODE_ENV === "production";

  res.cookie("edureach_token", token, {
    httpOnly: true,
    secure: production,
    sameSite: production ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

// Register
router.post("/register", async (req, res, next) => {
  try {
    const name =
      typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (name.length < 2 || name.length > 80) {
      return res.status(400).json({
        message: "Name must contain 2–80 characters.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        message: "Enter a valid email address.",
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        message: "Password must contain 8–72 characters.",
      });
    }

    const users = await getUsersCollection();

    // Create unique email index once; fails if duplicates already exist.
    await users.createIndex({ email: 1 }, { unique: true });

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const user = {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      createdAt: new Date(),
    };

    const result = await users.insertOne(user);
    user._id = result.insertedId;

    setAuthCookie(res, createToken(user));

    return res.status(201).json({
      message: "Account created successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }
    next(error);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    setAuthCookie(res, createToken(user));

    return res.json({
      message: "Login successful.",
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
});

// Current logged-in user
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.edureach_token;

    if (!token || !process.env.JWT_SECRET) {
      return res.status(401).json({ message: "Not logged in." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof payload === "string" || !ObjectId.isValid(payload.sub)) {
      return res.status(401).json({ message: "Invalid session." });
    }

    const users = await getUsersCollection();
    const user = await users.findOne(
      { _id: new ObjectId(payload.sub) },
      { projection: { passwordHash: 0 } }
    );

    if (!user) {
      return res.status(401).json({ message: "Account not found." });
    }

    return res.json({ user: publicUser(user) });
  } catch {
    return res.status(401).json({
      message: "Session expired. Please log in again.",
    });
  }
});

// Logout
router.post("/logout", (req, res) => {
  const production = process.env.NODE_ENV === "production";

  res.clearCookie("edureach_token", {
    httpOnly: true,
    secure: production,
    sameSite: production ? "none" : "lax",
    path: "/",
  });

  return res.json({ message: "Logged out successfully." });
});

export default router;
