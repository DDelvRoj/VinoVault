import { Producto } from '../type/producto.interface';
import { ProductoModel } from '../model/productoModel';
import { ConexionDataBase } from '../model/conexionBD';
export class ProductoService {
    
    private productoModel:ProductoModel;
    
    constructor(conexion:ConexionDataBase){
        this.productoModel = new ProductoModel(conexion);
    }

    async buscarProducto(item:Producto){
        try {
            return await this.productoModel.buscar(item);
        } catch (error) {
            throw error;   
        }
    }

    async crearProducto(item:Producto){
        try {
            await this.productoModel.insertar(item);
        } catch (error) {
            throw error;
        }
    }

    async modificarProducto(buscarPor:Producto, modificar:Producto){
        try {
            await this.productoModel.modificar(buscarPor, modificar);
        } catch (error) {
            throw error;
        }
    }

}