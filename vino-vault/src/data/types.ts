
export interface Evaluable {
  [key: string]: string|number|undefined;
}
export interface Producto extends Evaluable {
  id_producto?: string,
  ean?:string,
  nombre_producto?:string,
  cantidad?:number|0,
  imagen?:string,
  descripcion?:string,
  marca?:string,
  precio?:number|0,
}

export interface Persona {
  id_usuario?:string,
  usuario?: string,
  pseudoclave?: string,
  admin:boolean
}