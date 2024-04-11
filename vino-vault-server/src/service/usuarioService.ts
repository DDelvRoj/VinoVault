import { Usuario } from "../entity/usuario";
import { ConexionDataBase } from "../model/conexionBD";
import { QueryExecuterModel } from "../model/queryExecuterModel";
import bcryptUtil from "../util/bcryptUtil";
import { transformarTexto } from "../util/trasformarTextoUtil";

export class UsuarioService {
    
    private queryExecuter:QueryExecuterModel;

    constructor(conexion:ConexionDataBase){
        this.queryExecuter = new QueryExecuterModel(conexion);
    }

    async buscarUsuario (queryExecuter:Usuario)  {
        try {
            const usuarioValor = await this.queryExecuter.buscar(queryExecuter);
            return usuarioValor;
        } catch (error) {
            throw error;
        }
    }

    
    async coindicenDatos (nombre:Usuario)  {
        try {
            const usuarios = await this.queryExecuter.listar(new Usuario());
            const queryExecuter:Usuario = await usuarios.map(async u => {
                const usuarioValidacion = await bcryptUtil.desencriptarYCompararData(transformarTexto(nombre.nombre), u.queryExecuter);
                const claveValidacion = await bcryptUtil.desencriptarYCompararData(transformarTexto(nombre.clave),u.clave);   
                if(usuarioValidacion && claveValidacion){
                    return u;
                }
            })[0];
            if(queryExecuter){
                return queryExecuter;
            }
        } catch (error) {
            throw error;
        }
    }
    async crearUsuario(usuarioNuevo:Usuario) {
        try {
            await this.queryExecuter.insertar(usuarioNuevo);
        } catch (error) {
            throw error;
        }
    }

    async validarUsuario(usuarioValidable:Usuario){
        try {
           //await this.queryExecuter.coincidenDatos(usuarioValidable);
        } catch (error) {
            throw error;
        }
    }
}

