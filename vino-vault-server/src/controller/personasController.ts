import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { ConexionDataBase } from '../model/conexionBD';
import { visorSesion } from "../util/sesionUtil";
import { UsuarioService } from '../service/usuarioService';
import { Usuario } from "../entity/usuario";
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
        res.status(201).json(resultado)
    } catch (error) {
        console.log(error);
        res.status(500).json({error:`Error al realizar la carga de productos: ${error}`})
    }
})

personasRouter.post('/personas/validar/:id',authenticateToken , async (req:Request, res:Response)=>{
    const usuarioMod:Usuario = new Usuario({id_usuario:req.params['id']});
    let conexion:ConexionDataBase = new ConexionDataBase(visorSesion);
    try {
        await conexion.conectar();
        const usuarioBusqueda:Usuario = await (new UsuarioService(conexion)).buscarUsuario(usuarioMod);
        if(usuarioBusqueda === undefined || usuarioBusqueda === null){
            res.status(401).json({error:'El usuario no está registrado en la base de datos.'})
        }
        
        await conexion.desconectar();
        conexion = getConexionCargada(req);
        await conexion.conectar();
        await (new UsuarioService(conexion)).crearUsuario(usuarioBusqueda);
        /* Eliminamos la pseudoclave, imagina que este es y no a la vez la contraseña,
        *  lo que ocurre es que esta nos sirve para transformar la contraseña, despues encriptarla,
        * entonces la única manera de iniciar sesión es a traves de este servidor y no directamente desde,
        * la base de datos. 
        */
        usuarioBusqueda.pseudoclave=null;
        usuarioBusqueda.creado=true;
        await (new UsuarioService(conexion)).modificarUsuario(new Usuario(usuarioBusqueda));
        
        res.status(201).json({message:'Validación Éxitosa...'});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:`Error al realizar la validación: ${error}`})
    }  
})


personasRouter.post('/personas/registrar', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(username, password);
  const conexion: ConexionDataBase = new ConexionDataBase(visorSesion);
  const usuarioBuscador: UsuarioService = new UsuarioService(conexion);
  try {
    await conexion.conectar();
    // Verificar si el usuario ya existe en la base de datos
    const existeElUsuario = await usuarioBuscador.buscarUsuario(new Usuario({ usuario: username }));
    console.log("Buscando usuario...");
    if (existeElUsuario.id_usuario != null) {
      res.status(400).json({ error: 'El usuario ya existe' });
      return;
    }
    console.log("Creando usuario...");

    await usuarioBuscador.insertarUsuario(new Usuario({
        nombre: await bcryptUtil.encriptarData(transformarTexto(username)),
        admin: false,
        usuario: username,
        pseudoclave: password,
        clave: await bcryptUtil.encriptarData(transformarTexto(password)),
        creado: false
      }));

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error('Error al registrar usuario en Cassandra', err);
    res.status(500).json({ error: `Error al registrar usuario en Cassandra: ${err}` });
  }
  await conexion.desconectar();
}
);
export default personasRouter;