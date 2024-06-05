import { Store } from "pullstate";
import { ProductStoreState } from "./types";

interface Product {
  id: number;
  image: string;
  price: string;
  name: string;
  // Otros campos que pueda tener un producto
}
interface RealProductsStoreState{
  products:Product[]
}
interface ProductCategory {
  name: string;
  slug: string;
  cover: string;
  products: Product[];
}


export const RealProductStore = new Store<RealProductsStoreState>({
  products:[]
});
export const ProductStore = new Store<ProductStoreState>({
  products: []
});
