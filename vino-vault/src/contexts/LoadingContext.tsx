import React, { useState, createContext, ReactNode } from 'react';
import './LoadingContext.css'

// Crear el contexto con un valor predeterminado
export const LoadingContext = createContext({
  estaCargando: false,
  porciento: 0,
  descripcion: '',
  setEstaCargando: (estaCargando: boolean) => {},
  setPorciento:  (porciento: number) =>{},
  setDescripcion: (descripcion:string)=>{}
});

interface Props {
    children: ReactNode;
}
// Crear un proveedor de contexto
export const LoadingProvider: React.FC<Props> = ({ children }) => {
    const [estaCargando, setEstaCargando] = useState(false);
    const [porciento, setPorciento] = useState(0);
    const [descripcion, setDescripcion] = useState('');
    return (
      <LoadingContext.Provider value={{ estaCargando,porciento,descripcion,setPorciento, setEstaCargando, setDescripcion }}>
        {estaCargando ? (
        <div>
          <div className="ring text-loader">
            Cargando
            <span></span>
          </div>
          <div className='bottom-div text-loader'>
            {descripcion}
            <br />
            {porciento}%
          </div>
        </div>
        
        ) : (
            children
        )}
      </LoadingContext.Provider>
    );
  };
