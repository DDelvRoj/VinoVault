import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY: string | undefined = process.env.JWT_SECRET;
const UNA_HORA = 3600;

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Token de autenticación requerido' });
    }

    jwt.verify(token.split(' ')[1], SECRET_KEY || '', (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token de autenticación inválido' });
        }

        const horaActual = Date.now() / 1000;
        const primerAcceso = (decoded as any)['iat'];

        if (horaActual - primerAcceso >= UNA_HORA * 12) {
            return res.status(401).json({ error: 'Expiró la sesión, inicie sesión nuevamente.' });
        }

        (req as any).user = decoded; // Guarda los datos del usuario en req.user
        next();
    });
}

export function esAdmin(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    console.log('esAdmin: req.user:', user);

    if (!user) {
        return res.status(403).json({ error: 'No autenticado' });
    }

    if (user.admin === true) {
        console.log('esAdmin: usuario es admin');
        return next();
    } else {
        console.log('esAdmin: usuario NO es admin');
        return res.status(403).json({ error: 'Acceso solo permitido para administradores' });
    }
}
