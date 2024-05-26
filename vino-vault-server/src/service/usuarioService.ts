import { Usuario } from '../entity/usuario';
import { Usuario as UsuarioInterface } from "../type";
import { ConexionDataBase } from "../model/conexionBD";
import { QueryExecuterModel } from "../model/queryExecuterModel";
import bcryptUtil from "../util/bcryptUtil";
import { transformarTexto } from "../util/transformarTextoUtil";

export class UsuarioService {
    
    private queryExecuter:QueryExecuterModel;

    constructor(conexion:ConexionDataBase){
        this.queryExecuter = new QueryExecuterModel(conexion);
    }

    async listarUsuario(){
        try {
            const usuarios:UsuarioInterface[] = (await this.queryExecuter.listar(new Usuario())).map(valor=>{
                return valor as UsuarioInterface;
            });
            return usuarios;
        } catch (error) {
            throw error;
        }
    }

    async buscarUsuario (usuario:Usuario)  {
        try {
            const usuarioValor:Usuario = new Usuario(await this.queryExecuter.buscar(usuario) as UsuarioInterface)
            return usuarioValor;
        } catch (error) {
            throw error;
        }
    }
    
    async coindicenDatos (usuario:Usuario)  {
        try {
            
            const resultado:UsuarioInterface = await this.buscarUsuario(usuario);

            if(resultado!=undefined && resultado !=null){
                const usuarioValidacion = await bcryptUtil.desencriptarYCompararData(transformarTexto(usuario.usuario), resultado.nombre);
                const claveValidacion = await bcryptUtil.desencriptarYCompararData(transformarTexto(usuario.clave), resultado.clave); 
                if(usuarioValidacion && claveValidacion) return resultado;
            }
            return undefined;
        } catch (error) {
            throw error;
        }
    }
    async insertarUsuario(usuarioNuevo:Usuario) {
        try {
            await this.queryExecuter.insertar(usuarioNuevo);
        } catch (error) {
            throw error;
        }
    }

    async modificarUsuario(usuarioMod:Usuario){
        try {
            await this.queryExecuter.modificar(usuarioMod);
        } catch (error) {
            throw error;
        }
    }

    async crearUsuario(usuario:Usuario){
        try {
            await this.queryExecuter.comandosCustoms(usuario,'validar');
        } catch (error) {
            throw error;
        }
    }
}

