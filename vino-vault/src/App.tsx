import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { setupIonicReact } from '@ionic/react';
import Home from './pages/Home.tsx';

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
import { useEffect } from 'react';
import { fetchData } from './data/fetcher.ts';
import CategoryProducts from './pages/CategoryProducts.tsx';
import Product from './pages/Product.tsx';
import FavouriteProducts from './pages/FavouriteProducts.tsx';
import CartProducts from './pages/CartProducts.tsx';
import React from 'react';

setupIonicReact({});

const App = () => {

	useEffect(() => {

		fetchData();
	}, []);

	return (
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet >
					<Route path="/" exact={true}>
						<Redirect to="/home" />
					</Route>
					<Route path="/home" exact={true}>
						<Home />
					</Route>

					<Route path="/favourites" exact>
						<FavouriteProducts />
					</Route>

					<Route path="/cart" exact>
						<CartProducts />
					</Route>

					<Route path="/category/:slug" exact>
						<CategoryProducts />
					</Route>

					<Route path="/category/:slug/:id" exact>
						<Product />
					</Route>
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
}

export default App;
