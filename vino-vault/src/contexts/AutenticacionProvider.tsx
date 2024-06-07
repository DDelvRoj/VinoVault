// AuthProvider.tsx
import React, { ReactNode, useEffect } from 'react';
import { AutenticacionContext } from './AutenticacionContext';
import { guardarToken, TokenStore } from '../data/TokenStore';



interface AutenticacionProviderProps {
  children: ReactNode;
}

export const AutenticacionProvider: React.FC<AutenticacionProviderProps> = ({ children }) => {
    const token = TokenStore.useState(s=>s.token);
    useEffect(()=>{
        const estaLogeado = TokenStore.subscribe(
            s=>s.token,
            (nuevoToken, antiguoToken) => {
                console.log(`El valor de token cambió de ${antiguoToken} a ${nuevoToken}`);
                if(nuevoToken){
                    localStorage.setItem('token',nuevoToken);
                }
            }
        )
        return () => {
            estaLogeado();
          };
    },[]);

    const login = async (usuario: string, clave: string) => {
        // Aquí iría tu lógica de autenticación (fetch, API call, etc.)
        // Por simplicidad, asumimos que el login es exitoso si username y password no están vacíos
        if (usuario && clave) {
            guardarToken(usuario)
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
