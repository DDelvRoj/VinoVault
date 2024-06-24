import { Usuario } from '../entity/usuario';
import { Usuario as UsuarioInterface } from "../type";
import { ConexionDataBase } from "../model/conexionBD";
import { QueryExecuterModel } from "../model/queryExecuterModel";
import bcryptUtil from "../util/bcryptUtil";
import { transformarTexto } from "../util/transformarTextoUtil";
import { manejarErrores } from '../decorator';

export class UsuarioService {
    
    private queryExecuter:QueryExecuterModel;

    constructor(conexion:ConexionDataBase){
        this.queryExecuter = new QueryExecuterModel(conexion);
    }

    @manejarErrores
    async listarUsuario(){
        const usuarios:UsuarioInterface[] = (await this.queryExecuter.listar(new Usuario())).map(valor=>{
            return valor as UsuarioInterface;
        });
        return usuarios;
    }

    @manejarErrores
    async buscarUsuario (usuario:Usuario)  {
        const usuarioValor:Usuario = new Usuario(await this.queryExecuter.buscar(usuario) as UsuarioInterface)
        return usuarioValor;
    }
    
    @manejarErrores
    async coindicenDatos (usuario:Usuario)  {
        const usuarioBusqueda:Usuario = new Usuario({usuario:usuario.usuario});
        const resultado:UsuarioInterface = await this.buscarUsuario(usuarioBusqueda);
        if(resultado['params'].length>0){
            const usuarioValidacion = await bcryptUtil.desencriptarYCompararData(transformarTexto(usuario.usuario), resultado.nombre);
            const claveValidacion = await bcryptUtil.desencriptarYCompararData(transformarTexto(usuario.clave), resultado.clave); 
            if(usuarioValidacion && claveValidacion) return resultado;
        }
        return undefined;
    }

    @manejarErrores
    async insertarUsuario(usuarioNuevo:Usuario) {
        await this.queryExecuter.insertar(usuarioNuevo);
    }

    @manejarErrores
    async modificarUsuario(usuarioMod:Usuario){
        await this.queryExecuter.modificar(usuarioMod);
    }

    @manejarErrores
    async crearUsuario(usuario:Usuario){
        await this.queryExecuter.comandosCustoms(usuario,'validar',transformarTexto);
    }

    @manejarErrores
    async borrarUsuario(usuarioDel:Usuario){
        const usuarioConDataABorrar = await this.buscarUsuario(usuarioDel);
        await this.queryExecuter.comandosCustoms(usuarioConDataABorrar, 'borrar', transformarTexto)
        await this.queryExecuter.eliminar(usuarioDel);
    }

    @manejarErrores
    async cambiarRolUsuario(usuarioRol:Usuario){
        await this.queryExecuter.comandosCustoms(usuarioRol, 'darRol', transformarTexto, [['rol',(usuarioRol.admin?'administrativo':'usuario_bd')]])
    }
}

