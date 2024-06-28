import { Column, Entity } from "../decorator";
import { Producto as pro } from "../type";

@Entity('productos')
export class Producto {
    private _id_producto:string = null;
    private _ean:string;
    private _cantidad:number = 0;
    private _descripcion:string;
    private _imagen:string;
    private _marca:string;
    private _nombre_producto:string;
    private _precio:number = 0;
    
    @Column({esId:true, esUUID:true})
    public get id_producto() : string {
        return this._id_producto;
    }
    
    public set id_producto(v : string) {
        this._id_producto = v;
    }
    
    @Column({esId:true})
    public get ean() : string {
        return this._ean;
    }
    
    
    public set ean(v : string) {
        this._ean = v;
    }

    @Column()
    public get cantidad() : number {
        return this._cantidad;
    }
    
    public set cantidad(v : number) {
        this._cantidad = v;
    }

    @Column()
    public get descripcion() : string {
        return this._descripcion;
    }

    
    public set descripcion(v : string) {
        this._descripcion = v;
    }

    public get imagen() : string {
        return this._imagen;
    }
    
    
    public set imagen(imagen : string) {
        this._imagen = imagen;
    }

    @Column()
    public get marca() : string {
        return this._marca;
    }
    
    
    public set marca(v : string) {
        this._marca = v;
    }
    
    @Column()
    public get nombre_producto() : string {
        return this._nombre_producto;
    }
    
    
    public set nombre_producto(v : string) {
        this._nombre_producto = v;
    }
    
    @Column()
    public get precio() : number {
        return this._precio;
    }
    
    
    public set precio(v : number) {
        this._precio = v;
    }
    
    constructor(pro?:pro){
        if(pro){
            this._cantidad=pro.cantidad;
            this._descripcion=pro.descripcion;
            this._ean=pro.ean;
            this._id_producto=pro.id_producto;
            this._marca=pro.marca;
            this._nombre_producto=pro.nombre_producto;
            this._imagen = pro.imagen;
            this._precio=pro.precio;
        }
    }
}