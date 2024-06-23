import { ProductStore, vaciarProductStore } from "./ProductStore.ts";
import { vaciarTokenStore } from "./TokenStore.ts";
import { Persona, Producto } from "./types.ts";

const link:string = 'http://localhost:3000'


export const fetchData = async () =>{
  const products:Producto[] = (await fetchProductos()).map(p=>{
    if(p.imagen){
      p.imagen = `data:image/png;base64,${p.imagen}`;
    }
    return p;
  });

  console.log(products);
  
  ProductStore.update(s=>{
    s.products = products;
    if(products.length>0){
      localStorage.setItem('productos',JSON.stringify(products));
    }
  });
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
      switch(response.status){
        case 401:
          vaciarTokenStore();
          break;
        default:
          vaciarTokenStore();
          vaciarProductStore();
          break;
      }
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
  return apiFetch<Persona[]>('personas','GET', await authHeader());
};

const fetchProductos = async () => {
  return apiFetch<Producto[]>('productos/listar/todos','GET', await authHeader());
};

export const fetchProductById = async (id:string) => {
  return apiFetch<Producto>( `/${id}`,'GET', await authHeader());
};