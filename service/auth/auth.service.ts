import prisma from "@/lib/prisma";
import authRegistry from "./auth.registry";
import { AuthenticationError, ConflictError } from "@/lib/errors";
import type {
  RegisterInput,
  LoginInput,
  AuthResponse,
  JwtPayload,
} from "@/types/auth";

/**
 * Auth service — Facade that orchestrates register/login flows
 * using strategies retrieved from the AuthRegistry.
 */

class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const passwordStrategy = authRegistry.getPasswordStrategy();
    const tokenStrategy = authRegistry.getTokenStrategy();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { username: input.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === input.email) {
        throw new ConflictError("A user with this email already exists");
      }
      throw new ConflictError("A user with this username already exists");
    }

    const hashedPassword = await passwordStrategy.hash(input.password);

    const user = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        password: hashedPassword,
      },
    });

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = tokenStrategy.generateAccessToken(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
      accessToken,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const passwordStrategy = authRegistry.getPasswordStrategy();
    const tokenStrategy = authRegistry.getTokenStrategy();

    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    const isPasswordValid = await passwordStrategy.compare(
      input.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = tokenStrategy.generateAccessToken(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
      accessToken,
    };
  }
}

const authService = new AuthService();
export default authService;
