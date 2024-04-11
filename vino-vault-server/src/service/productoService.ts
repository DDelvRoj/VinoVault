import { ConexionDataBase } from '../model/conexionBD';
import { QueryExecuterModel } from '../model/queryExecuterModel';
export class ProductoService {
    
    private queryExecuter: QueryExecuterModel;
    
    constructor(conexion:ConexionDataBase){
        this.queryExecuter = new QueryExecuterModel(conexion);
    }

    async buscarProducto(item:any){
        try {
            return await this.queryExecuter.buscar(item);
        } catch (error) {
            throw error;   
        }
    }

    async crearProducto(item:any){
        try {
            await this.queryExecuter.insertar(item);
        } catch (error) {
            throw error;
        }
    }

    async modificarProducto(modificar:any){
        try {
            await this.queryExecuter.modificar(modificar);
        } catch (error) {
            throw error;
        }
    }

}