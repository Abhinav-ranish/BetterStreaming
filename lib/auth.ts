import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const createToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};
