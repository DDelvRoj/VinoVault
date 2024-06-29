import { Store } from "pullstate";
import { Persona } from "./types";

interface PersonaStoreState {
    personas:Persona[]
}

export const PersonasStore = new Store<PersonaStoreState>({
    personas : [] 
});

