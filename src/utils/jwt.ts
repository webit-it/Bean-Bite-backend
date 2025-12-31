import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";
import { Messages } from "../constants/messages";

export interface CustomJwtPayload extends DefaultJwtPayload {
  id: string;
  isAdmin: boolean;
}

/* ---------------- ACCESS TOKEN ---------------- */

export const generateToken = (id: string, isAdmin: boolean): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error(Messages.JWT_NOT_DEFINED);
  }

  return jwt.sign(
    { id, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "6h" }
  );
};

/* ---------------- REFRESH TOKEN ---------------- */

export const generateRefreshToken = (id: string, isAdmin: boolean): string => {
  if (!process.env.REFRESH_JWT_SECRET) {
    throw new Error(Messages.REFRESH_JWT_SECRET_NOT_DEFINED);
  }

  return jwt.sign(
    { id, isAdmin },
    process.env.REFRESH_JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/* ---------------- VERIFY ---------------- */

export const verifyAccessToken = (token: string): CustomJwtPayload => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as CustomJwtPayload;
};

export const verifyRefreshToken = (token: string): CustomJwtPayload => {
  return jwt.verify(
    token,
    process.env.REFRESH_JWT_SECRET as string
  ) as CustomJwtPayload;
};
