import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import buscarCodigoDeBarra from "../service/webScrapingService";
import {Producto as ProductoInterface, ProductoTemp as ProductoTempInterface, Usuario} from '../type'
import { ultimosCambios } from "../middleware/ultimosCambiosMiddleware";
import { ConexionDataBase } from "../model/conexionBD";
import { ProductoService } from "../service/productoService";
import { ProductoTempService } from "../service/productoTempService";
import { Producto } from "../entity/producto";
import { transformarTexto } from "../util/transformarTextoUtil";
import { ProductoTemp } from "../entity/productoTemp";

const productosRouter = Router();

// Falta middleware de acceso
productosRouter.get('/productos', authenticateToken, ultimosCambios(1000000),
async (req: Request, res: Response) => {
    const usuario:Usuario = req['user'];
    usuario.clave = transformarTexto(usuario.clave);
    usuario.usuario = transformarTexto(usuario.usuario);
    console.log(usuario);
    const conexion: ConexionDataBase = new ConexionDataBase({username:usuario.usuario, password:usuario.clave});
    const productoServ: ProductoService = new ProductoService(conexion);
    const productoTempServ: ProductoTempService = new ProductoTempService(conexion);
    const codigo = req.query.codigo.toString();
  try {
    const buscarProducto = async (): Promise<ProductoInterface | ProductoTemp> => {
    try {
        // Conectar a la base de datos
        await conexion.conectar();
        // Buscar el producto en la tabla principal CAMBIAR
        let resultado: ProductoInterface | ProductoTemp | undefined = await productoServ.buscarProducto(new Producto({ ean: codigo }));
        // Si no se encuentra en la tabla principal, buscar en la tabla temporal
        if (resultado === undefined || resultado === null) {
          //CAMBIAR
            resultado = await productoTempServ.buscarProducto(new ProductoTemp({ ean: codigo }));
            if(resultado === undefined || resultado === null) {
              resultado = await buscarCodigoDeBarra(codigo);
              await productoTempServ.crearProducto(new ProductoTemp(resultado));
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
  const producto = await buscarProducto().then(resultado => {
      return resultado;
  }).catch(error => {
      console.error('Error al obtener el producto:', error);
      res.status(404).json({error:'No logramos encontrar el producto requerido en ninguna base de datos, '+
      'cabe la posibilidad de que el producto buscado haya caído en falsificación, '+
      'no tiene documentos en órden, o simplemente no exista. En estás situaciones le recomendamos ingresar el producto '+
      'manualmente.'
    })
  });
  
    const productoDataLength:string = Buffer.byteLength(JSON.stringify(producto),'utf-8').toString();
    res.appendHeader('Content-Length',productoDataLength);
    res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({error:'error'})
  }
});

export default productosRouter;