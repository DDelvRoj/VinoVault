import { ConexionDataBase } from "../model/conexionBD";
import { ProductoTempModel } from "../model/productoTempModel";
import { ProductoTemp } from '../type/producto.interface';

export class ProductoTempService {

    private productoTempModel:ProductoTempModel;

    constructor(conexion:ConexionDataBase){
        this.productoTempModel = new ProductoTempModel(conexion);
    }

    async buscarProducto(item:ProductoTemp){
        try {
            return (await this.productoTempModel.buscar(item));
        } catch (error) {
            throw error;
        }
    }
    async crearProducto(item:ProductoTemp){
        try {
            await this.productoTempModel.insertar(item);
        } catch (error) {
            throw error;
        }
    }

}