import { Router, Request, Response } from "express";
import bcrypt from 'bcrypt';
import { UsuarioModel } from "../model/usuarioModel";
import { visorSesion } from "../util/sesionUtil";

const registroRouter:Router = Router();

registroRouter.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const cliente = new UsuarioModel(visorSesion);
    try {
      if (await !cliente.conectar()){
        res.status(500).json({ error: 'No se pudo conectar a la base de datos.' });
        return;
      };
  
      // Verificar si el usuario ya existe en la base de datos
      const existeElUsuario = await cliente.obtenerUsuarioPorUsername(username);
      console.log("Buscando usuario...");
      if (existeElUsuario != null) {
        const error = { error: 'El usuario ya existe' };
        console.log(error);
        return res.status(400).json(error);
      }
      console.log("Creando usuario...");
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insertar el nuevo usuario en la base de datos
      await cliente.crearUsuario(username,hashedPassword);
      res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
      console.error('Error al registrar usuario en Cassandra', err);
      res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
    }
    await cliente.desconectar();
  }
);

export default registroRouter;