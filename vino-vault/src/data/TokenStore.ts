import { Store } from "pullstate"

interface TokenStoreState {
    token:string|undefined|null
}

export const TokenStore = new Store<TokenStoreState>({
    token:localStorage.getItem('token')?.toString()
});

export const guardarToken = (token:string|null)=>{
    TokenStore.update(s=>{
        s.token=token
    });
}