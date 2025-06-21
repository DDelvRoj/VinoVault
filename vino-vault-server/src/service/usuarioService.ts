import { Usuario } from '../entity/usuario';
import { Usuario as UsuarioInterface } from "../type";
import { ConexionDataBase } from "../model/conexionBD";
import { QueryExecuterModel } from "../model/queryExecuterModel";
import bcryptUtil from "../util/bcryptUtil";
import { transformarTexto } from "../util/transformarTextoUtil";
import { manejarErrores } from '../decorator';

export class UsuarioService {
    
    private queryExecuter: QueryExecuterModel;

    constructor(conexion: ConexionDataBase){
        this.queryExecuter = new QueryExecuterModel(conexion);
    }

    @manejarErrores
    async listarUsuario(){
        console.log('Iniciando listado de usuarios');
        const usuarios: UsuarioInterface[] = (await this.queryExecuter.listar(new Usuario())).map(valor => {
            return valor as UsuarioInterface;
        });
        console.log('Usuarios listados:', usuarios);
        return usuarios;
    }

    @manejarErrores
    async buscarUsuario(usuario: Usuario) {
        console.log('Buscando usuario con parámetros:', usuario);
        const usuarioValor: Usuario = new Usuario(await this.queryExecuter.buscar(usuario) as UsuarioInterface);
        console.log('Usuario encontrado:', usuarioValor);
        return usuarioValor;
    }

    @manejarErrores
    async coindicenDatos(usuario: Usuario) {
        console.log('Verificando datos del usuario:', usuario);
        const usuarioBusqueda: Usuario = new Usuario({ usuario: usuario.usuario });
        const resultado: UsuarioInterface = await this.buscarUsuario(usuarioBusqueda);
        
        if (resultado['params'].length > 0) {
            const usuarioValidacion = await bcryptUtil.desencriptarYCompararData(transformarTexto(usuario.usuario), resultado.nombre);
            const claveValidacion = await bcryptUtil.desencriptarYCompararData(transformarTexto(usuario.clave), resultado.clave);
            
            if (usuarioValidacion && claveValidacion) {
                console.log('Usuario y clave validados correctamente');
                return resultado;
            } else {
                console.log('Error en validación de usuario o clave');
            }
        } else {
            console.log('No se encontró coincidencia en la búsqueda de usuario');
        }
        
        return undefined;
    }

    @manejarErrores
    async insertarUsuario(usuarioNuevo: Usuario) {
        console.log('Insertando nuevo usuario:', usuarioNuevo);
        await this.queryExecuter.insertar(usuarioNuevo);
        console.log('Usuario insertado exitosamente');
    }

    @manejarErrores
    async modificarUsuario(usuarioMod: Usuario) {
        console.log('Modificando usuario con ID:', usuarioMod.id_usuario);
        await this.queryExecuter.modificar(usuarioMod);
        console.log('Usuario modificado exitosamente');
    }

    @manejarErrores
    async crearUsuario(usuario: Usuario) {
        console.log('Creando usuario:', usuario);
        await this.queryExecuter.comandosCustoms(usuario, 'validar', transformarTexto);
        console.log('Usuario creado exitosamente');
    }

    @manejarErrores
    async borrarUsuario(usuarioDel: Usuario) {
        console.log('Borrando usuario con ID:', usuarioDel.id_usuario);
        await this.queryExecuter.eliminar(usuarioDel);
        console.log('Usuario eliminado exitosamente');
    }

    @manejarErrores
    async borrarCuentaUsuario(usuarioDel: Usuario) {
        console.log('Borrando cuenta de usuario:', usuarioDel);
        await this.queryExecuter.comandosCustoms(usuarioDel, 'borrar', transformarTexto);
        console.log('Cuenta de usuario eliminada exitosamente');
    }

    @manejarErrores
    async cambiarRolUsuario(usuarioRol: Usuario) {
        console.log('Cambiando rol de usuario con ID:', usuarioRol.id_usuario);
        const nuevoRol = usuarioRol.admin ? 'administrativo' : 'usuario_bd';
        console.log('Nuevo rol asignado:', nuevoRol);
        await this.queryExecuter.comandosCustoms(usuarioRol, 'darRol', transformarTexto, [['rol', nuevoRol]]);
        console.log('Rol de usuario cambiado exitosamente');
    }
}
