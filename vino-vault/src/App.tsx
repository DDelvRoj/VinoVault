import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { setupIonicReact } from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Home from './pages/Home.tsx';
import Product from './pages/Product.tsx';
import FavouriteProducts from './pages/FavouriteProducts.tsx';
import CartProducts from './pages/CartProducts.tsx';
import UserSettings from './pages/UserSettings.tsx';
import AddUser from './pages/AddUser.tsx';
import RegistrarProducto from './pages/RegistrarProducto.tsx';
import Login from './pages/Login.tsx';
import { useAutenticacion } from './contexts/AutenticacionContext.tsx';
import { AutenticacionProvider } from './contexts/AutenticacionProvider.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { useEffect, useState } from 'react';
import SalesList from './pages/SalesList.tsx';


setupIonicReact({});

const App: React.FC = () => {

	return (
		<AutenticacionProvider>
			<IonApp>
				<Rutas/>
			</IonApp>
		</AutenticacionProvider>
	);
}

const Rutas: React.FC = ()=>{

	const {token} = useAutenticacion();
	const [logeado, setLogeado] = useState<boolean>(true);

	useEffect(()=>{
		setLogeado(token?true:false);
	},[token])

	return(
		<IonReactRouter>
				<IonRouterOutlet >
					<Route exact={true} path="/">
						<Redirect to='/home'/>
					</Route>
					<ProtectedRoute path="/home" component={Home} estaLogeado={logeado} exact/>

					<Route path="/login" exact>
						<Login/>
					</Route>

					<ProtectedRoute path="/favourites" component={FavouriteProducts} estaLogeado={logeado} exact/>

					<ProtectedRoute path="/cart" component={CartProducts} estaLogeado={logeado} exact/>

					<ProtectedRoute path="/producto/:id" component={Product} estaLogeado={logeado} exact/>

					<ProtectedRoute path="/registrar-producto" component={RegistrarProducto} estaLogeado={logeado} exact/>
					
					<ProtectedRoute path="/ajustes-usuario" component={UserSettings} estaLogeado={logeado} exact/>
					
					<ProtectedRoute path="/add-user" component={AddUser} estaLogeado={logeado} exact/>

					<ProtectedRoute path="/ventas" component={SalesList} estaLogeado={logeado} exact/>
					
				</IonRouterOutlet>
		</IonReactRouter>
	);
}

export default App;