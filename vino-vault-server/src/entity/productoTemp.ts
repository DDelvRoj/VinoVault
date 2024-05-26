import { Column, Entity } from "../decorator";
import { ProductoTemp as prodTemp } from '../type';


@Entity('productos_temps')
export class ProductoTemp {
    private _ean:string;
    private _descripcion:string;
    private _imagen:string;
    private _marca:string;
    private _nombre_producto:string;
    
    @Column({esId:true})
    public get ean() : string {
        return this._ean;
    }
    
    
    public set ean(v : string) {
        this._ean = v;
    }

    @Column()
    public get imagen() : string {
        return this._imagen;
    }

    
    public set imagen(v : string) {
        this._imagen = v;
    }


    @Column()
    public get descripcion() : string {
        return this._descripcion;
    }

    
    public set descripcion(v : string) {
        this._descripcion = v;
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
    constructor(prodTemp?:prodTemp){
        if(prodTemp){
            this._ean = prodTemp.ean;
            this._descripcion = prodTemp.descripcion;
            this._imagen = prodTemp.imagen;
            this._marca = prodTemp.marca;
            this._nombre_producto = prodTemp.nombre_producto;
        }
    }
}