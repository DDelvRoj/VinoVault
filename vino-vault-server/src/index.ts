import express from 'express';
import cors from 'cors';
import loginRouter from './controller/loginController';
import productosRouter from './controller/productosController';
import personasRouter from './controller/personasController';
import validarDispositivos from './middleware/dispositivosPermitidosMiddleware';

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;



app.use(express.json());

// Habilitar CORS con las opciones configuradas
app.use(cors({origin:'*'}));

app.use(validarDispositivos);



app.use(loginRouter);
app.use(personasRouter)
app.use(productosRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
