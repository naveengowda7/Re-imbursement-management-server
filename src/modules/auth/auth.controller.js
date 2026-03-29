import * as authService from "./auth.service.js";

export const signup = async (req, res) => {
  const result = await authService.signup(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res.json({
    accessToken: result.accessToken,
    user: result.user,
  });
};

export const login = async (req, res) => {
  const result = await authService.login(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  res.json({
    accessToken: result.accessToken,
    user: result.user,
  });
};
import jwt from "jsonwebtoken";
import { generateAccessToken } from "./token.service.js";

export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "No token" });

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const user = await db.user.findUnique({
    where: { id: decoded.sub },
  });

  const accessToken = generateAccessToken(user);

  res.json({ accessToken });
};
export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

export const me = async (req, res) => {
  res.json(req.user);
};