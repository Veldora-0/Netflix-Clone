import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { db } from '../data/store';
import { AppError } from '../middleware/error.middleware';
import { User, UserSafe } from '../types';

export class AuthService {
  private toUserSafe(user: User): UserSafe {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );
  }

  public async register(name: string, email: string, password: string): Promise<{ user: UserSafe; token: string }> {
    const existing = db.findUserByEmail(email);
    if (existing) {
      const error: AppError = new Error('An account with this email address already exists');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = db.createUser(name, email, passwordHash);
    const token = this.generateToken(newUser);

    return {
      user: this.toUserSafe(newUser),
      token,
    };
  }

  public async login(email: string, password: string): Promise<{ user: UserSafe; token: string }> {
    const user = db.findUserByEmail(email);
    if (!user) {
      const error: AppError = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error: AppError = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);

    return {
      user: this.toUserSafe(user),
      token,
    };
  }
}

export const authService = new AuthService();
