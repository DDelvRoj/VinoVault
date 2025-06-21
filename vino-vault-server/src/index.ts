import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';  // Importar dotenv para cargar variables de entorno
import loginRouter from './controller/loginController';  // Reemplaza con la ruta correcta
import productosRouter from './controller/productosController';  // Reemplaza con la ruta correcta
import personasRouter from './controller/personasController';  // Reemplaza con la ruta correcta
import { ConexionDataBase } from './model/conexionBD';  // Importar la clase de conexión a Cassandra

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Configuración de CORS: permitir solo solicitudes del frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Se recomienda especificar el origen de tu frontend
  methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
  allowedHeaders: 'Content-Type,Authorization', // Headers permitidos
};

app.use(express.json({ limit: '50mb' })); // Habilitar JSON en el cuerpo de la solicitud
app.use(cors(corsOptions)); // Habilitar CORS con las opciones configuradas

// Inicializar la conexión a Cassandra
const conexionDB = new ConexionDataBase({
  username: String(process.env.CASSANDRA_USERNAME || ''),
  password: String(process.env.CASSANDRA_PASSWORD || '')
});


conexionDB.conectar().then(() => {
  console.log('Conexión exitosa a Cassandra');
}).catch(err => {
  console.error('Error de conexión a Cassandra:', err);
});

// Agregar las rutas de la aplicación
app.use(loginRouter);
app.use(personasRouter);
app.use(productosRouter);

// Middleware para capturar errores no manejados
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Hubo un error interno en el servidor' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
  console.log('El servidor ha sido iniciado correctamente');
});
