import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY = process.env.JWT_SECRET!;
const DURACION_TOKEN = '12h';

export function firmarToken(payload: any): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: DURACION_TOKEN });
}

export function verificarToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ error: 'Token de autenticación requerido' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'Token de autenticación requerido' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token de autenticación inválido o expirado' });
        }

        (req as any).user = user;
        next();
    });
}
