import React, { useState, createContext, ReactNode } from 'react';

// Crear el contexto con un valor predeterminado
export const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (value: boolean) => {},
});

interface Props {
    children: ReactNode;
    // Aquí van el resto de tus props
  }
// Crear un proveedor de contexto
export const LoadingProvider: React.FC<Props> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
  
    return (
      <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
        {isLoading ? (
        <div className="loading">
            {/* Aquí puedes añadir cualquier elemento que quieras mostrar cuando isLoading es true */}
            <p>Cargando...</p>
        </div>
        ) : (
            children
        )}
      </LoadingContext.Provider>
    );
  };
