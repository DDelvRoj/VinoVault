import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { ConexionDataBase } from '../model/conexionBD';
import { visorSesion } from "../util/sesionUtil";
import { UsuarioService } from '../service/usuarioService';
import { Usuario } from "../entity/usuario";
import { Usuario as UsuarioType } from "../type";
import { getConexionCargada } from "../util/conexionUtil";
import bcryptUtil from "../util/bcryptUtil";
import { transformarTexto } from "../util/transformarTextoUtil";

const personasRouter:Router = Router();


personasRouter.get('/personas', authenticateToken, async (req:Request, res:Response)=>{
    const conexion:ConexionDataBase = getConexionCargada(req);
    const usuarioService:UsuarioService = new UsuarioService(conexion);
    try {
        await conexion.conectar();
        
        const resultado = (await usuarioService.listarUsuario()).map(usuario=>{
          usuario.clave = usuario.pseudoclave = usuario.nombre = undefined;
          return usuario;
        });
        
        await conexion.desconectar();
        res.status(200).json(resultado)
    } catch (error) {
        console.log(error);
        res.status(500).json({error:`Error al realizar la carga de productos: ${error}`})
    }
});

personasRouter.delete('/personas/:id', authenticateToken, async (req:Request, res:Response)=> {
  const conexion:ConexionDataBase = getConexionCargada(req);
  console.log("Tamo aqui",req.params['id']);
  
  try {
    const usuarioService = await new UsuarioService(conexion);
    await conexion.conectar();
    const usuarioConSoloID = new Usuario({id_usuario:req.params['id']});
    await usuarioService.borrarUsuario(usuarioConSoloID);
    res.status(204).json({msj:`Usuario eliminado con éxito.`})
  } catch (err) {
    console.error('Error al borrar usuario en Cassandra', err);
    res.status(500).json({ error: `Error al borrar usuario en Cassandra: ${err}` });
  } finally {
    await conexion.desconectar();
  }
});

personasRouter.post('/personas',authenticateToken , async (req: Request, res: Response) => {
  const conexion: ConexionDataBase = getConexionCargada(req);
  const usuarioNuevo:UsuarioType = req.body;
  console.log(usuarioNuevo);

  try {
    
    await conexion.conectar();
    // Verificar si el usuario ya existe en la base de datos
    
    if ((await  new UsuarioService(conexion).buscarUsuario(new Usuario({ usuario: usuarioNuevo.usuario }))).id_usuario != null) {
      res.status(400).json({ error: 'El usuario ya existe' });
      return;
    }
    const usOb = new Usuario({
      nombre: await bcryptUtil.encriptarData(transformarTexto(usuarioNuevo.usuario)),
      admin: usuarioNuevo.admin,
      usuario: usuarioNuevo.usuario,
      pseudoclave: usuarioNuevo.pseudoclave,
      clave: await bcryptUtil.encriptarData(transformarTexto(usuarioNuevo.pseudoclave)),
      creado: false
    });
    console.log(usOb);
    

    await new UsuarioService(conexion).insertarUsuario(usOb);
    console.log('Usuario creado, buscando su id...');
    
    const usuarioConID = await  new UsuarioService(conexion).buscarUsuario(new Usuario({ usuario: usuarioNuevo.usuario }));
    await new UsuarioService(conexion).crearUsuario( usuarioConID );
    console.log(`Id encontrado ${usuarioConID.id_usuario}, dandole un rol...`);
    
    await new UsuarioService(conexion).cambiarRolUsuario(usuarioConID);

    
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error('Error al registrar usuario en Cassandra', err);
    res.status(500).json({ error: `Error al registrar usuario en Cassandra: ${err}` });
  } finally {
    await conexion.desconectar();
  }
  
});

personasRouter

export default personasRouter;