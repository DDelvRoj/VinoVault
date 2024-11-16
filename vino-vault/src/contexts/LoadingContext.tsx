import React, { useState, createContext, ReactNode } from 'react';
import './LoadingContext.css';

// Crear el contexto con un valor predeterminado
export const LoadingContext = createContext({
  estaCargando: false,
  descripcion: '',
  setEstaCargando: (estaCargando: boolean) => {},
  setDescripcion: (descripcion:string)=>{}
});

interface Props {
  children: ReactNode;
}

// Crear un proveedor de contexto
export const LoadingProvider: React.FC<Props> = ({ children }) => {
  const [estaCargando, setEstaCargando] = useState(false);
  const [descripcion, setDescripcion] = useState('');

  return (
    <LoadingContext.Provider value={{ estaCargando, descripcion, setEstaCargando, setDescripcion }}>
      {children}
      {estaCargando && (
        <div className="loader-overlay">
          <div className="ring">
            Cargando
            <span></span>
          </div>
          <div className='bottom-div'>
            {descripcion}
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};
