import { Column, Entity } from "../decorator";
import { Usuario as Us } from "../type/index";

 @Entity("usuarios" ,[
    ['validar',"CREATE USER IF NOT EXISTS ':usuario' WITH PASSWORD ':clave'"]
 ])
export class Usuario {
   
    private _id_usuario: string;
    private _nombre: string;
    private _usuario:string;
    private _clave:string;
    private _pseudoclave:string;
    private _creado:boolean;
    private _admin: boolean;

    @Column({esId:true,esUUID:true})
    public get id_usuario() :  string{
        return this._id_usuario
    }
    
    public set id_usuario(id_usuario : string) {
        this._id_usuario = id_usuario;
    }
    
    public set pseudoclave(pseudoclave : string) {
        this._pseudoclave = pseudoclave;
    }

    @Column()
    public get pseudoclave() : string {
        return this._pseudoclave;
    }
    
    @Column()
    public get nombre(): string {
        return this._nombre;
    }

    public set nombre(value: string) {
        this._nombre = value;
    }

    @Column({esId:true})
    public get usuario() : string {
        return this._usuario;
    }
    
    public set usuario(usuario : string) {
        this._usuario = usuario;
    }

    @Column()
    public get clave() : string {
        return this._clave;
    }

    public set clave(clave : string) {
        this._clave = clave;
    }
    
    @Column()
    public get creado() : boolean {
        return this._creado;
    }
    
    public set creado(creado : boolean) {
        this._creado = creado;
    }

    @Column()
    public get admin() : boolean {
        return this._admin;
    }
    
    public set admin(admin : boolean) {
        this._admin = admin;
    }
    
    constructor(usuario?: Us) {
        if (usuario) {
            this._id_usuario = usuario.id_usuario;
            this._nombre = usuario.nombre;
            this._pseudoclave = usuario.pseudoclave;
            this._admin = usuario.admin;
            this._usuario = usuario.usuario;
            this._clave = usuario.clave;
            this._creado = usuario.creado;
        }
    }   
}