import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

interface ProtectedRouteProps extends RouteProps {
  estaLogeado: boolean;
  // Puedes agregar más props según sea necesario
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  estaLogeado,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      estaLogeado ? (
        Component ? <Component {...props} /> : null
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default ProtectedRoute;
