import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import buscarCodigoDeBarra from "../service/webScrapingService";

const productosRouter = Router();

// Falta middleware de acceso
productosRouter.get('/productos', async (req: Request, res: Response) => {
  try {
    const codigo = req.query.codigo;
    const producto:Producto = await buscarCodigoDeBarra(codigo.toString());
    res.json(producto);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({error:'error'})
  }
});

export default productosRouter;