import { ProductStore } from "./ProductStore.ts";



export const fetchData = async (): Promise<ProductCategory[]> => {
  const json = ["beds.json", "armchairs.json", "coffee_tables.json", "cushions.json", "floor_lamps.json", "office_chairs.json"];

  let products: ProductCategory[] = [];

  for (const category of json) {
    const categoryProducts = await fetchProducts(category);

    let categoryName = category.replace(".json", "").replace("_", " ");
    categoryName = uppercaseWords(categoryName);

    const productCategory: ProductCategory = {
      name: categoryName,
      slug: category.replace(".json", ""),
      cover: categoryProducts[6]?.image || "", // Agrega una verificación de existencia
      products: categoryProducts
    };

    products = [...products, productCategory];
    ProductStore.update(s => { s.products = [...s.products, productCategory]; });
  }

  return products;
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

const uppercaseWords = (words: string): string => {
  return words.toLowerCase()
    .split(' ')
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}
