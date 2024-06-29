import { Store } from "pullstate"
import { Persona } from "./types";

interface SesionStoreType {
    miSesion:Persona
}

export const SesionStore = new Store<SesionStoreType>({
    miSesion:{admin:false}
});