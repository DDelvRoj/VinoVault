import { Store } from "pullstate";

interface Product {
  id: number;
  image: string;
  price: string;
  name: string;
  // Otros campos que pueda tener un producto
}
interface ProductStoreState{
  products:Product[]
}



export const ProductStore = new Store<ProductStoreState>({
  products: []
});
