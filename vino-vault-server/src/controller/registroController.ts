import { Router, Request, Response } from "express";
import { visorSesion } from "../util/sesionUtil";
import bcryptUtil from "../util/bcryptUtil";
import { UsuarioService } from "../service/usuarioService";
import { Credential, Usuario } from "../type";
import { ConexionDataBase } from "../model/conexionBD";
import { transformarTexto } from "../util/trasformarTextoUtil";
import { types } from "cassandra-driver";

const registroRouter:Router = Router();

registroRouter.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log(username , password);
    const conexion:ConexionDataBase = new ConexionDataBase(visorSesion);
    const usuarioBuscador:UsuarioService = new UsuarioService(conexion);
    try {
      await conexion.conectar();
      // Verificar si el usuario ya existe en la base de datos

      const existeElUsuario = await usuarioBuscador.buscarUsuario({usuario:username});
      console.log("Buscando usuario...");
      if (existeElUsuario != null) {
        res.status(400).json({ error: 'El usuario ya existe' });
        return;
      }
      console.log("Creando usuario...");

      const nuevoUsuarioCredential:Usuario = {
        id_usuario: types.Uuid.random(),
        usuario: await bcryptUtil.encriptarData(transformarTexto(username)),
        clave: await bcryptUtil.encriptarData(transformarTexto(password)),
        creado: false
      };
      
      await usuarioBuscador.crearUsuario(nuevoUsuarioCredential);

      res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
      console.error('Error al registrar usuario en Cassandra', err);
      res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
    }
    await conexion.desconectar();
  }
);

export default registroRouter;