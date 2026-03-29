import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";

// 🔐 Generate Tokens
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      companyId: user.companyId,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );
};

// 📝 SIGNUP (Create Company + Admin)
export const signup = async (data) => {
  const { name, email, password, companyName } = data;

  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Create company
  const company = await prisma.company.create({
    data: {
      name: companyName,
    },
  });

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_ROUNDS) || 12
  );

  // Create admin user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      companyId: company.id,
    },
  });

  // Tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    user,
  };
};

// 🔑 LOGIN
export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.isActive) {
    throw new Error("Account deactivated");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    user,
  };
};

// 🔄 REFRESH TOKEN
export const refreshTokenService = async (token) => {
  if (!token) {
    throw new Error("No refresh token");
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};