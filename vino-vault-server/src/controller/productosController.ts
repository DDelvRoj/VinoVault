import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import buscarCodigoDeBarra from "../service/webScrapingService";
import {Producto, ProductoTemp, Usuario} from '../type'
import { ultimosCambios } from "../middleware/ultimosCambiosMiddleware";
import { ConexionDataBase } from "../model/conexionBD";
import { ProductoService } from "../service/productoService";
import { ProductoTempService } from "../service/productoTempService";

const productosRouter = Router();

// Falta middleware de acceso
productosRouter.get('/productos', authenticateToken, ultimosCambios(1000000),
async (req: Request, res: Response) => {
  try {
    const usuario:Usuario = req['user'];
    const codigo = req.query.codigo.toString();
    const buscarProducto = async (): Promise<Producto | ProductoTemp> => {
      try {
          const conexion: ConexionDataBase = new ConexionDataBase({ username: usuario.usuario, password: usuario.clave });
          const productoServ: ProductoService = new ProductoService(conexion);
          const productoTempServ: ProductoTempService = new ProductoTempService(conexion);
  
          // Conectar a la base de datos
          await conexion.conectar();
  
          // Buscar el producto en la tabla principal
          let resultado: Producto | ProductoTemp | undefined = await productoServ.buscarProducto({ ean: codigo });
  
          // Si no se encuentra en la tabla principal, buscar en la tabla temporal
          if (resultado === undefined) {
              resultado = await productoTempServ.buscarProducto({ ean: codigo });
              if(resultado === undefined) {
                resultado = await buscarCodigoDeBarra(codigo);
                await productoTempServ.crearProducto(resultado);
              }
          }

          // Retornar el resultado
          return resultado !== undefined ? resultado : null;
      } catch (error) {
          // Manejar cualquier error que pueda ocurrir durante la ejecución
          console.error('Error al buscar el producto:', error);
          throw error;
      }
  };
  // Para usar el valor devuelto por la función asíncrona, debes llamarla y esperar su resultado
  const producto = buscarProducto().then(resultado => {
      return resultado;
  }).catch(error => {
      console.error('Error al obtener el producto:', error);
  });
  
    const productoDataLength:number = Buffer.byteLength(JSON.stringify(producto),'utf-8');
    res.appendHeader('Content-Length',productoDataLength.toString());
    res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({error:'error'})
  }
});

export default productosRouter;