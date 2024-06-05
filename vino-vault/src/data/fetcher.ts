import { ProductStore } from "./ProductStore.ts";
import { Product } from "./types.ts";


export const fetchData = async () =>{
  const products:any = await fetchProducts('armchairs.json');
  ProductStore.update(s=>{s.products =  [...products]});
}

const fetchProducts = async (category: string): Promise<Product[]> => {
  const response = await fetch(`products/${category}`);
  const data: Product[] = await response.json();

  // Set a product id
  data.forEach((d, i) => {
    d.id = i + 1;
  });

  return data;
}
