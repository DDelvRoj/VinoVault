export interface Producto {
    id_producto?: string,
    ean?:string,
    nombre_producto?:string,
    cantidad?:number,
    descripcion?:string,
    marca?:string,
    precio?:number
}

export interface ProductoTemp {
    ean?:string,
    descripcion?:string,
    imagen?:string,
    marca?:string,
    nombre_producto?:string
}