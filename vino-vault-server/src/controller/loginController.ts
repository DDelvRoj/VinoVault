import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { ConexionDataBase } from '../model/conexionBD';
import { firmarToken, verificarToken } from '../util/tokenUtil';

const loginRouter = Router();

async function getUserFromDatabase(username: string) {
    const conexionDB = new ConexionDataBase({
        username: String(process.env.CASSANDRA_USERNAME || ''),
        password: String(process.env.CASSANDRA_PASSWORD || '')
    });
    await conexionDB.conectar();

    const query = 'SELECT * FROM usuarios WHERE usuario = ?';
    const params = [username];

    try {
        const result = await conexionDB.getClient().execute(query, params, { prepare: true });
        console.log('Usuario encontrado:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error al obtener el usuario desde Cassandra:', error);
        throw error;
    } finally {
        await conexionDB.desconectar();
    }
}

// POST /login
loginRouter.post('/login', async (req: Request, res: Response) => {
    console.log('Recibiendo solicitud de login...');
    try {
        const { username, password } = req.body;
        console.log(`Username recibido: ${username}`);

        const user = await getUserFromDatabase(username);

        if (!user) {
            console.log(`Usuario ${username} no encontrado`);
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        console.log(`Contraseña almacenada en la base de datos: ${user.clave}`);

        if (!user.clave) {
            return res.status(500).json({ error: 'Error de contraseña en la base de datos' });
        }

        const passwordMatch = await bcrypt.compare(password, user.clave);

        if (!passwordMatch) {
            console.log(`Contraseña incorrecta para el usuario ${username}`);
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        console.log(`Contraseña correcta para el usuario ${username}, generando el token...`);

        // 🚩 Aquí es la clave: incluir `admin` en el token
        const token = firmarToken({ username, admin: user.admin });

        res.status(200).json({ token });
        console.log(`Token generado para el usuario ${username}: ${token}`);
    } catch (err) {
        console.error('Error en el proceso de login:', err);
        res.status(500).json({ error: 'Error al procesar el login' });
    }
});

// GET /mi-sesion → para comprobar sesión activa
loginRouter.get('/mi-sesion', verificarToken, (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Sesión activa',
        user: (req as any).user
    });
});

export default loginRouter;
