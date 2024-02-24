import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { authenticateToken } from './middleware/authMiddleware';
import { apagar, conectar, crearSesionVisor } from './service/cassandraService';
import loginRouter from './controller/loginController';
import registroRouter from './controller/registroController';

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(cors());
app.use(loginRouter);
app.use(registroRouter)
// Ruta protegida que requiere autenticación
app.get('/protected', authenticateToken, async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM employees'; // Cambia esto al nombre de tu tabla de empleados
    const client = crearSesionVisor();
    await conectar(client);
    const result = await client.execute(query);
    await apagar(client);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener empleados desde Cassandra', err);
    res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
