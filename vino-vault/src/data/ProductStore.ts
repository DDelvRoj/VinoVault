import { Store } from "pullstate";

interface Product {
  id: number;
  image: string;
  price: string;
  name: string;
  // Otros campos que pueda tener un producto
}

interface ProductCategory {
  name: string;
  slug: string;
  cover: string;
  products: Product[];
}

interface ProductStoreState {
  products: ProductCategory[];
}

export const ProductStore = new Store<ProductStoreState>({
  products: []
});
