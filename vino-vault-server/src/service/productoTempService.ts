import { manejarErrores } from "../decorator";
import { ProductoTemp } from "../entity/productoTemp";
import { ConexionDataBase } from "../model/conexionBD";
import { QueryExecuterModel } from "../model/queryExecuterModel";

export class ProductoTempService {

    private queryExecuter:QueryExecuterModel;

    constructor(conexion:ConexionDataBase){
        this.queryExecuter = new QueryExecuterModel(conexion);
    }

    @manejarErrores
    async buscarProducto(item:ProductoTemp){
        return (await this.queryExecuter.buscar(item));
    }

    @manejarErrores
    async crearProducto(item:ProductoTemp){
        await this.queryExecuter.insertar(item);
    }

}