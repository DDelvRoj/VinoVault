
export interface ConjuntoProducto{

    category: ProductCategory, 
    product: Product
}
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