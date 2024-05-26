import { Producto } from '../entity/producto';
import { ConexionDataBase } from '../model/conexionBD';
import { QueryExecuterModel } from '../model/queryExecuterModel';
export class ProductoService {
    
    private queryExecuter: QueryExecuterModel;
    
    constructor(conexion:ConexionDataBase){
        this.queryExecuter = new QueryExecuterModel(conexion);
    }

    async listarProductos(){
        try {
            return await this.queryExecuter.listar(new Producto())
        } catch (error) {
            throw error;
        }
    }
    async buscarProducto(item:Producto){
        try {
            return await this.queryExecuter.buscar(item);
        } catch (error) {
            throw error;   
        }
    }

    async crearProducto(item:Producto){
        try {
            await this.queryExecuter.insertar(item);
        } catch (error) {
            throw error;
        }
    }

    async modificarProducto(modificar:Producto){
        try {
            await this.queryExecuter.modificar(modificar);
        } catch (error) {
            throw error;
        }
    }

}