import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { authenticateToken } from './middleware/authMiddleware';
import loginRouter from './controller/loginController';
import registroRouter from './controller/registroController';
import productosRouter from './controller/productosController';

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(cors());
app.use(loginRouter);
app.use(registroRouter);
app.use(productosRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
