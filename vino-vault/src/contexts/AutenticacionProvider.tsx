// AuthProvider.tsx
import React, { ReactNode, useEffect } from 'react';
import { AutenticacionContext } from './AutenticacionContext';
import { TokenStore } from '../data/TokenStore';
import { fetchLogin, fetchMiSesion} from '../data/fetcher';
import { useIonToast } from '@ionic/react';
import { SesionStore } from '../data/SesionStore';



interface AutenticacionProviderProps {
  children: ReactNode;
}

export const AutenticacionProvider: React.FC<AutenticacionProviderProps> = ({ children }) => {
    const [ mostrar ] = useIonToast();
    const token = TokenStore.useState(s=>s.token);
    const miID = SesionStore.useState(s=>s.miSesion.usuario);
    const [toast] = useIonToast();

    const guardarToken = (token:string|null)=>{
        TokenStore.update(s=>{
            s.token=token;
            if(token){
                localStorage.setItem('token',token);
            } else {
                localStorage.removeItem('token');
            }
        })
    }
    
    useEffect(()=>{
        const estaLogeado = TokenStore.subscribe(
            s=>s.token,
            (nuevoToken) => {
                if(nuevoToken){
                    localStorage.setItem('token',nuevoToken);
                }
            }
        )

        return () => {
            estaLogeado();
          };
    },[]);

    useEffect(()=>{
        fetchMiSesion().then(res=>{
            if(res){
                
                SesionStore.update(s=>{
                    s.miSesion=res;
                });
                toast(`Bienvenido ${miID}`,3000);
            }
        });
    },[token])

    const login = async (usuario: string, clave: string) => {
        if (usuario && clave) {
            await fetchLogin(usuario,clave).then((value)=>{
                if(value !== undefined && value !== null){
                    guardarToken(value.token);
                }
            }).catch((error=>{
                mostrar({message:`No es posible conectarse al servidor. ${error}`, duration:3000});
            }));
        } else {
        throw new Error('Login fallido');
        }
    };

    const logout = () => {
        guardarToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AutenticacionContext.Provider value={{ token, login, logout }}>
        {children}
        </AutenticacionContext.Provider>
    );
};
