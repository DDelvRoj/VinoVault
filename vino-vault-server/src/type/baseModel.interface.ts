export interface BaseModelInterface <T> {
    buscar(item:T):Promise<T>,
    eliminar(item:T):Promise<void>,
    insertar(item:T):Promise<void>,
    modificar(where:T,changes:T):Promise<void>,
    listar():Promise<T[]>
}