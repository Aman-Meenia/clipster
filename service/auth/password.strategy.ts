import bcrypt from "bcryptjs";

/**
 * Strategy pattern for password hashing.
 * Allows swapping the hashing algorithm without touching consumers.
 */

export interface IPasswordStrategy {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

export class BcryptPasswordStrategy implements IPasswordStrategy {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 12) {
    this.saltRounds = saltRounds;
  }

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
