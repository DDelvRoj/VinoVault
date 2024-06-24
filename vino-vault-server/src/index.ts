import express from 'express';
import cors from 'cors';
import loginRouter from './controller/loginController';
import productosRouter from './controller/productosController';
import personasRouter from './controller/personasController';

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Lista de orígenes permitidos
const allowedOrigins = ['http://localhost:8100'];

// Opciones de configuración de CORS
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Habilitar CORS con las opciones configuradas
app.use(cors(corsOptions));
app.use(express.json());

app.use(loginRouter);
app.use(personasRouter)
app.use(productosRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
