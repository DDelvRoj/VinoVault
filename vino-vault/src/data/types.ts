
export interface Producto {
  id_producto?: string,
  ean?:string,
  nombre_producto?:string,
  cantidad:number|0,
  imagen?:string,
  descripcion?:string,
  marca?:string,
  precio:number|0
}