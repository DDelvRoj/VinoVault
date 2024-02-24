import { Router, Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";

const productosRouter = Router();

productosRouter.get('/productos', authenticateToken, async (req: Request, res: Response) => {
  
});

export default productosRouter;