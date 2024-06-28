import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { ConexionDataBase } from '../model/conexionBD';
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
  
  try {

    const usuarioService = await new UsuarioService(conexion);
    await conexion.conectar();
    const usuarioConSoloID = new Usuario({id_usuario:req.params['id']});
    await usuarioService.borrarCuentaUsuario(await usuarioService.buscarUsuario(usuarioConSoloID));
    await usuarioService.borrarUsuario(usuarioConSoloID);

    res.status(204).json({msj:`Usuario eliminado con éxito.`});

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

  try {
    
    await conexion.conectar();
    
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

    await new UsuarioService(conexion).insertarUsuario(usOb);
    const usuarioConID = await  new UsuarioService(conexion).buscarUsuario(new Usuario({ usuario: usuarioNuevo.usuario }));
    await new UsuarioService(conexion).crearUsuario( usuarioConID );
    await new UsuarioService(conexion).cambiarRolUsuario(usuarioConID);

    res.status(201).json({ msj: 'Usuario registrado correctamente' });

  } catch (err) {

    console.error('Error al registrar usuario en Cassandra', err);
    res.status(500).json({ error: `Error al registrar usuario en Cassandra: ${err}` });

  } finally {
    await conexion.desconectar();
  }
  
});

personasRouter.put('/personas',authenticateToken, async (req:Request, res:Response)=>{
  const conexion = getConexionCargada(req);
  const usuarioService = new UsuarioService(conexion);
  const usuarioData = req.body as UsuarioType;
  try {

    await conexion.conectar();
    await usuarioService.borrarCuentaUsuario(await usuarioService.buscarUsuario(new Usuario({id_usuario:usuarioData.id_usuario})));

    if(usuarioData.pseudoclave){
      usuarioData.clave = await bcryptUtil.encriptarData(transformarTexto(usuarioData.pseudoclave));
    }

    if(usuarioData.usuario){
      usuarioData.nombre = await bcryptUtil.encriptarData(transformarTexto(usuarioData.usuario));
    }

    await usuarioService.modificarUsuario(new Usuario(usuarioData));
    const usuarioActualizado = await usuarioService.buscarUsuario(new Usuario({id_usuario:usuarioData.id_usuario}));
    await usuarioService.crearUsuario(usuarioActualizado)
    await usuarioService.cambiarRolUsuario(usuarioActualizado);
    await usuarioService.modificarUsuario(new Usuario(usuarioData));

    res.status(201).send({msj: 'Usuario modificado correctamente.'});

  } catch (error) {
    console.error(error);
    res.status(500).json({error: `Error al modificar usuario en Cassandra : ${error}`});
  } finally {
    await conexion.desconectar();
  }
});

export default personasRouter;