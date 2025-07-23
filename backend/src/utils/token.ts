import jwt from "jsonwebtoken";

export const generateToken = (user_id: number) => {
  return jwt.sign({ user_id }, process.env.AUTH_SECRET!, { expiresIn: "1h" });
};
