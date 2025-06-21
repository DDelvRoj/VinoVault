import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { ConexionDataBase } from "../model/conexionBD";
import { ProductoService } from "../service/productoService";
import { Producto } from "../entity/producto";
import { getConexionCargada } from "../util/conexionUtil";

const productosRouter = Router();

// GET - Listar todos
productosRouter.get('/productos/listar/todos', authenticateToken, async (req: Request, res: Response) => {
    const conexion = getConexionCargada(req);
    const productoService = new ProductoService(conexion);

    try {
        await conexion.conectar();
        const resultado = await productoService.listarProductos();
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: `Error al listar productos: ${error}` });
    } finally {
        await conexion.desconectar();
    }
});

// POST - Crear
productosRouter.post('/productos', authenticateToken, async (req: Request, res: Response) => {
    const conexion = getConexionCargada(req);
    const productoService = new ProductoService(conexion);
    const productoData = req.body;

    try {
        await conexion.conectar();
        const nuevoProducto = new Producto(productoData);
        await productoService.crearProducto(nuevoProducto);
        res.status(201).json({ msj: 'Producto creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: `Error al crear producto: ${error}` });
    } finally {
        await conexion.desconectar();
    }
});

// PUT - Modificar
productosRouter.put('/productos', authenticateToken, async (req: Request, res: Response) => {
    const conexion = getConexionCargada(req);
    const productoService = new ProductoService(conexion);
    const productoData = req.body;

    try {
        await conexion.conectar();
        const productoMod = new Producto(productoData);
        await productoService.modificarProducto(productoMod);
        res.status(200).json({ msj: 'Producto modificado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: `Error al modificar producto: ${error}` });
    } finally {
        await conexion.desconectar();
    }
});

// DELETE - Eliminar (CORRECTO)
productosRouter.delete('/productos/:id', authenticateToken, async (req: Request, res: Response) => {
    const conexion = getConexionCargada(req);
    const productoService = new ProductoService(conexion);
    const id_producto = req.params.id;

    try {
        await conexion.conectar();
        const productoEliminar = new Producto({ id_producto });
        await productoService.eliminarProducto(productoEliminar);
        res.status(200).json({ msj: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: `Error al eliminar producto: ${error}` });
    } finally {
        await conexion.desconectar();
    }
});

// PUT - Vender productos
productosRouter.put('/productos/vender', authenticateToken, async (req: Request, res: Response) => {
  const conexion = getConexionCargada(req);
  const productoService = new ProductoService(conexion);
  const productosAVender = req.body; // Array de productos [{ id_producto, cantidad }]

  try {
      await conexion.conectar();

      for (const p of productosAVender) {
          const productoDB = await productoService.buscarProducto(new Producto({ id_producto: p.id_producto }));

          if (!productoDB) {
              console.error(`Producto con id ${p.id_producto} no encontrado`);
              continue;
          }

          const nuevaCantidad = (productoDB.cantidad ?? 0) - (p.cantidad ?? 0);
          const productoMod = new Producto({
              id_producto: p.id_producto,
              cantidad: nuevaCantidad < 0 ? 0 : nuevaCantidad
          });

          await productoService.modificarProducto(productoMod);
      }

      res.status(200).json({ msj: 'Venta realizada correctamente' });
  } catch (error) {
      res.status(500).json({ error: `Error al realizar venta: ${error}` });
  } finally {
      await conexion.desconectar();
  }
});


export default productosRouter;
