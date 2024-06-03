import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY: string | undefined = process.env.CLAVE_FIRMA;


// Middleware para autenticación con JWT
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ error: 'Token de autenticación requerido' });
    }
    jwt.verify(token.split(' ')[1], SECRET_KEY || '', (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Token de autenticación inválido' });
      }
      req['user'] = decoded; // Los datos del usuario decodificados se adjuntan a req.user
      next();
    });
  }