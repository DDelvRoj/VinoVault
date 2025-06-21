import { Router, Request, Response } from "express";
import { verificarToken } from "../util/tokenUtil";
import { ConexionDataBase } from '../model/conexionBD';
import { UsuarioService } from '../service/usuarioService';
import { Usuario } from "../entity/usuario";
import { Usuario as UsuarioType } from "../type";
import { getConexionCargada } from "../util/conexionUtil";
import bcryptUtil from "../util/bcryptUtil";
import { transformarTexto } from "../util/transformarTextoUtil";

const personasRouter: Router = Router();

// ✅ Proteger todas las rutas
personasRouter.use(verificarToken);

// GET /personas
personasRouter.get('/personas', async (req: Request, res: Response) => {
    const conexion = getConexionCargada(req);
    const usuarioService = new UsuarioService(conexion);

    try {
        await conexion.conectar();

        const resultado = (await usuarioService.listarUsuario()).map(usuario => {
            usuario.clave = usuario.pseudoclave = usuario.nombre = undefined;
            return usuario;
        });

        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: `Error al realizar la carga de usuarios: ${error}` });
    } finally {
        await conexion.desconectar();
    }
});

// DELETE /personas/:id
personasRouter.delete('/personas/:id', async (req: Request, res: Response) => {
    const conexion = getConexionCargada(req);
    const usuarioService = new UsuarioService(conexion);

    try {
        await conexion.conectar();
        const usuarioConSoloID = new Usuario({ id_usuario: req.params['id'] });

        await usuarioService.borrarCuentaUsuario(await usuarioService.buscarUsuario(usuarioConSoloID));
        await usuarioService.borrarUsuario(usuarioConSoloID);

        res.status(204).json({ msj: `Usuario eliminado con éxito.` });
    } catch (err) {
        res.status(500).json({ error: `Error al borrar usuario en Cassandra: ${err}` });
    } finally {
        await conexion.desconectar();
    }
});

// POST /personas
personasRouter.post('/personas', async (req: Request, res: Response) => {
    const conexion = getConexionCargada(req);
    const usuarioNuevo: UsuarioType = req.body;
    const usuarioService = new UsuarioService(conexion);

    try {
        await conexion.conectar();

        const usuarioExistente = await usuarioService.buscarUsuario(new Usuario({ usuario: usuarioNuevo.usuario }));

        if (usuarioExistente.id_usuario != null) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const usOb = new Usuario({
            nombre: await bcryptUtil.encriptarData(transformarTexto(usuarioNuevo.usuario)),
            admin: usuarioNuevo.admin,
            usuario: usuarioNuevo.usuario,
            pseudoclave: usuarioNuevo.pseudoclave,
            clave: await bcryptUtil.encriptarData(transformarTexto(usuarioNuevo.pseudoclave)),
            creado: false
        });

        await usuarioService.insertarUsuario(usOb);
        const usuarioConID = await usuarioService.buscarUsuario(new Usuario({ usuario: usuarioNuevo.usuario }));

        await usuarioService.crearUsuario(usuarioConID);
        await usuarioService.cambiarRolUsuario(usuarioConID);

        res.status(201).json({ msj: 'Usuario registrado correctamente' });
    } catch (err) {
        res.status(500).json({ error: `Error al registrar usuario en Cassandra: ${err}` });
    } finally {
        await conexion.desconectar();
    }
});

// PUT /personas
personasRouter.put('/personas', async (req: Request, res: Response) => {
    const conexion = getConexionCargada(req);
    const usuarioService = new UsuarioService(conexion);
    const usuarioData = req.body as UsuarioType;

    try {
        await conexion.conectar();

        await usuarioService.borrarCuentaUsuario(await usuarioService.buscarUsuario(new Usuario({ id_usuario: usuarioData.id_usuario })));

        if (usuarioData.pseudoclave) {
            usuarioData.clave = await bcryptUtil.encriptarData(transformarTexto(usuarioData.pseudoclave));
        }

        if (usuarioData.usuario) {
            usuarioData.nombre = await bcryptUtil.encriptarData(transformarTexto(usuarioData.usuario));
        }

        await usuarioService.modificarUsuario(new Usuario(usuarioData));

        const usuarioActualizado = await usuarioService.buscarUsuario(new Usuario({ id_usuario: usuarioData.id_usuario }));
        await usuarioService.crearUsuario(usuarioActualizado);
        await usuarioService.cambiarRolUsuario(usuarioActualizado);

        res.status(201).send({ msj: `Usuario ${usuarioActualizado.usuario} modificado correctamente.` });
    } catch (error) {
        res.status(500).json({ error: `Error al modificar usuario en Cassandra : ${error}` });
    } finally {
        await conexion.desconectar();
    }
});

export default personasRouter;
