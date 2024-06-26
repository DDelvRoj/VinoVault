import { Store } from "pullstate";
import { Producto } from "./types";


interface ProductStoreState{
  products:Producto[]
}



export const ProductStore = new Store<ProductStoreState>({
  products: (JSON.parse(localStorage.getItem('productos')??'[]') as Producto[]) 
});