export interface Product {
  id?: number;
  image?: string;
  price?: string;
  name?: string;
  // Otros campos que pueda tener un producto
}

export interface ProductCategory {
  id?: number;
  name?: string;
  slug?: string;
  cover?: string;
  products?: Product[];
}

export interface Producto {
  id_producto?: string,
  ean?:string,
  nombre_producto?:string,
  cantidad?:number,
  descripcion?:string,
  marca?:string,
  precio?:number
}

export interface ProductStoreState {
  products: ProductCategory[];
}

export interface FavouritesStoreState {
  total: number;
  product_ids: string[];
}

export interface CartStoreState {
  total: number;
  product_ids: string[];
}