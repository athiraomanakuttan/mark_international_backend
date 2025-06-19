// generate a JWT token with a given payload and secret
import jwt from 'jsonwebtoken';
const jwtTokenSecret = process.env.JWT_TOKEN_SECRET;

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, jwtTokenSecret!, { expiresIn: '15m' });
}

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, jwtTokenSecret!, { expiresIn: '7d' });
}

export const verifyToken = (token: string): boolean => {
  try {
    const isTokenValid = jwt.verify(token, jwtTokenSecret!);
    return isTokenValid ? true : false;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

