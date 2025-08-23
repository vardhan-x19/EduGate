import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../Model/UserModel';
import dotenv from 'dotenv';
dotenv.config();


const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const JWT_SECRET : string = process.env.JWT_SECRET as string;
  console.log('JWT_SECRET:',JWT_SECRET);
  let token: string | undefined;

  // Check for Bearer token in Authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Check for token in cookies (using cookie-parser)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  console.log('Token:',token); 
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded :any = jwt.verify(token, JWT_SECRET as string);
    console.log('Decoded JWT:', decoded,decoded.id);
    // Attach user info to request object if needed
    const user = await userModel.findById(decoded.id);
    console.log('Authenticated user:', user);
    if (!user) {
      // console.log('!user');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    (req as any).user = user;
    // (req as any).user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({err: err.message });
  }
};

export default authenticate;