import { ProductoTemp } from "../entity/productoTemp";
import { ConexionDataBase } from "../model/conexionBD";
import { QueryExecuterModel } from "../model/queryExecuterModel";

export class ProductoTempService {

    private queryExecuter:QueryExecuterModel;

    constructor(conexion:ConexionDataBase){
        this.queryExecuter = new QueryExecuterModel(conexion);
    }

    async buscarProducto(item:ProductoTemp){
        try {
            return (await this.queryExecuter.buscar(item));
        } catch (error) {
            throw error;
        }
    }
    async crearProducto(item:ProductoTemp){
        try {
            await this.queryExecuter.insertar(item);
        } catch (error) {
            throw error;
        }
    }

}