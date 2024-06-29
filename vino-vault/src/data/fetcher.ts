import { CapacitorHttp } from "@capacitor/core";
import { ProductStore } from "./ProductStore.ts";
import { vaciarTokenStore } from "./TokenStore.ts";
import { Persona, Producto } from "./types.ts";
const link:string = 'http://localhost:3000';

export const fetchData = async () =>{
  const products:Producto[] = (await fetchProductos()).map(p=>{
    if(p.imagen){
      p.imagen = `data:image/png;base64,${p.imagen}`;
    }
    return p;
  });
  
  ProductStore.update(s=>{
    s.products = products;
    if(products.length>0){
      localStorage.setItem('productos',JSON.stringify(products));
    }
  });
}

interface FetchConfig {
  method: string;
  headers: { [key: string]: string };
  data?: any;
}

const apiFetch = async <T>(
  ruta: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  headers?: { [key: string]: string },
  data?: any
): Promise<T> => {
  const url = `${link}/${ruta}`;

  const defaultHeaders: { [key: string]: string } = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const config: FetchConfig = {
    method: method,
    headers: defaultHeaders,
    data: data
  };

  try {
    const response = await CapacitorHttp.request({
      method: config.method,
      url: url,
      headers: config.headers,
      data: config.data
    });

    if (!response || response.status >= 400) {
      const errorMessage = `Error: ${response.status}`;
      switch(response.status){
        case 401:
          vaciarTokenStore();
          break;
      }
      throw new Error(errorMessage);
    }

    return response.data as T;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const authHeader = async () =>{
  const token = localStorage.getItem('token');
  const authHeader = {
    'Authorization':`Bearer ${token}`
  };
  return authHeader;
}

export const fetchLogin = async (username:string, password:string) => {
  const body = { username, password };
  return apiFetch<any>('login', 'POST', undefined, body);
};

export const fetchMiSesion = async ()=>{
  return apiFetch<any>('login','GET', await authHeader()); 
}

export const fetchPersonasBorrar = async (id:string) =>{
  return apiFetch<any>(`personas/${id}`,'DELETE', await authHeader());
}

export const fetchPersonas = async () => { 
  return apiFetch<Persona[]>('personas','GET', await authHeader());
};

export const fetchPersonasAgregar = async (persona:Persona) =>{
  return apiFetch<any>('personas','POST', await authHeader(), persona);
}

export const fetchPersonasModificar = async (persona:Persona) =>{
  return apiFetch<any>('personas','PUT', await authHeader(), persona);
}

const fetchProductos = async () => {
  return apiFetch<Producto[]>('productos/listar/todos','GET', await authHeader());
};

export const fetchProductosVender = async (productos:Producto[]) => {
  return apiFetch<any>('productos/vender','PUT', await authHeader(), productos);
}

export const fetchProductoAgregar = async (producto:Producto) => {
  return apiFetch<any>(`productos`,'POST', await authHeader(), producto);
}
export const fetchProductoModificar = async (producto:Producto) => {
  return apiFetch<any>('productos', "PUT", await authHeader(), producto);
}
export const fetchProductoCodigoBarra = async (producto:Producto) => {
  return apiFetch<Producto>(`productos/codigo/${producto.ean}`,'GET', await authHeader());
};

export const fetchProductById = async (id:string) => {
  return apiFetch<Producto>(`productos/${id}`,'GET', await authHeader());
};