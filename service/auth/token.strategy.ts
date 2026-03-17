import jwt from "jsonwebtoken";
import config from "@/config/config";
import type { JwtPayload } from "@/types/auth";

/**
 * Strategy pattern for token generation & verification.
 * Allows swapping JWT for another token mechanism (e.g. PASETO) without touching consumers.
 */

export interface ITokenStrategy {
  generateAccessToken(payload: JwtPayload): string;
  verifyAccessToken(token: string): JwtPayload;
}

export class JwtTokenStrategy implements ITokenStrategy {
  private readonly secret: string;
  private readonly accessTokenExpiry: string;

  constructor() {
    this.secret = config.JWT_SECRET;
    this.accessTokenExpiry = config.ACCESS_TOKEN_EXPIRY;
  }

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.accessTokenExpiry as jwt.SignOptions["expiresIn"],
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }
}
