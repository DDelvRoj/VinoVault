import { Router, Request, Response } from "express";
import { visorSesion } from "../util/sesionUtil";
import bcryptUtil from "../util/bcryptUtil";
import { UsuarioService } from "../service/usuarioService";
import { Credential } from "../type";

const registroRouter:Router = Router();

registroRouter.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const usuarioBuscador:UsuarioService = new UsuarioService(visorSesion);
    try {
      await usuarioBuscador.conectar();
      // Verificar si el usuario ya existe en la base de datos
      const existeElUsuario = await usuarioBuscador.buscarUsuarioPorNombre(username);
      console.log("Buscando usuario...");
      if (existeElUsuario != null) {
        res.status(400).json({ error: 'El usuario ya existe' });
        return;
      }
      console.log("Creando usuario...");
      // Hashear la contraseña
      const nuevoUsuarioCredential:Credential = {
        username: username,
        password: await bcryptUtil.encriptarPassword(password)
      };
      // Insertar el nuevo usuario en la base de datos
      await usuarioBuscador.crearUsuario(nuevoUsuarioCredential);

      res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
      console.error('Error al registrar usuario en Cassandra', err);
      res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
    }
    await usuarioBuscador.desconectar();
  }
);

export default registroRouter;