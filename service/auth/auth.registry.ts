import {
  BcryptPasswordStrategy,
  type IPasswordStrategy,
} from "./password.strategy";
import { JwtTokenStrategy, type ITokenStrategy } from "./token.strategy";

/**
 * Registry pattern — central place to register and retrieve auth strategies.
 * Singleton instance ensures consistent strategy usage across the app.
 */

class AuthRegistry {
  private passwordStrategy: IPasswordStrategy;
  private tokenStrategy: ITokenStrategy;

  constructor() {
    this.passwordStrategy = new BcryptPasswordStrategy();
    this.tokenStrategy = new JwtTokenStrategy();
  }

  getPasswordStrategy(): IPasswordStrategy {
    return this.passwordStrategy;
  }

  getTokenStrategy(): ITokenStrategy {
    return this.tokenStrategy;
  }

  setPasswordStrategy(strategy: IPasswordStrategy): void {
    this.passwordStrategy = strategy;
  }

  setTokenStrategy(strategy: ITokenStrategy): void {
    this.tokenStrategy = strategy;
  }
}

const authRegistry = new AuthRegistry();
export default authRegistry;
