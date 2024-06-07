import { ProductStore } from "./ProductStore.ts";
import { Product } from "./types.ts";

const link:string = 'http://localhost:3000'


export const fetchData = async () =>{
  const products:any = await fetchProducts('armchairs.json');
  ProductStore.update(s=>{s.products =  [...products]});
}

const fetchProducts = async (id: string): Promise<Product[]> => {
  const response = await fetch(`products/${id}`);
  const data: Product[] = await response.json();

  // Set a product id
  data.forEach((d, i) => {
    d.id = i + 1;
  });

  return data;
}


interface FetchConfig {
  method: string;
  headers: HeadersInit;
  body?: string;
}

const apiFetch = async <T>(
  ruta: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  headers?: HeadersInit,
  body?: Record<string, any>
): Promise<T> => {
  const url = `${link}/${ruta}`;
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const config: FetchConfig = {
    method: method,
    headers: defaultHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorMessage = `Error: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const authHeader = async ()=>{
  const token = localStorage.getItem('token');
  const authHeader:HeadersInit = {
    'Authorization':`Bearer ${token}`
  }
  return authHeader
}

export const fetchLogin = async (username:string, password:string) => {
  const body = { username, password };
  return apiFetch<any>('login', 'POST', undefined, body);
};

export const fetchPersonas = async () => { 
  return apiFetch('personas','GET', await authHeader());
};

export const fetchProductos = async () => {
  return apiFetch<Product[]>('productos','GET', await authHeader());
};

export const fetchProductById = async (id:string) => {
  return apiFetch<Product>( `/${id}`,'GET', await authHeader());
};