import { manejarErrores } from "../decorator";
import { ProductoTemp } from "../entity/productoTemp";
import { ConexionDataBase } from "../model/conexionBD";
import { QueryExecuterModel } from "../model/queryExecuterModel";

export class ProductoTempService {

    private queryExecuter: QueryExecuterModel;

    constructor(conexion: ConexionDataBase) {
        this.queryExecuter = new QueryExecuterModel(conexion);
    }

    @manejarErrores
    async buscarProducto(item: ProductoTemp) {
        console.log('Buscando producto temporal con parámetros:', item);
        try {
            const resultado = await this.queryExecuter.buscar(item);
            console.log('Producto temporal encontrado:', resultado);
            return resultado;
        } catch (error) {
            console.error('Error al buscar producto temporal:', error);
            throw error;
        }
    }

    @manejarErrores
    async crearProducto(item: ProductoTemp) {
        console.log('Creando nuevo producto temporal:', item);
        try {
            await this.queryExecuter.insertar(item);
            console.log('Producto temporal creado con éxito');
        } catch (error) {
            console.error('Error al crear producto temporal:', error);
            throw error;
        }
    }
}
