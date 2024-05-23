
import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';

import "./Home.css";
import { cart, heart } from 'ionicons/icons';

import { ProductStore } from '../data/ProductStore.ts';
import { FavouritesStore } from '../data/FavouritesStore.ts';
import { CartStore } from '../data/CartStore.ts';
import React, { useMemo } from 'react';

const Home : React.FC = ()=> {

  	const products = ProductStore.useState(s => s.products);
  	const favourites = FavouritesStore.useState(s => s.product_ids);
	const shopCart = CartStore.useState(s => s.product_ids);
	//se memoizan las categorias para que solo se calculen una vez no se q
	const uniqueCategories = useMemo(() => {
        const categoryMap = new Map();
        products.forEach(product => {
            if (!categoryMap.has(product.slug)) {
                categoryMap.set(product.slug, product);
            }
        });
        return Array.from(categoryMap.values());
    }, [products]);

	return (
		<IonPage id="home-page" className="homePage ">
			<IonHeader>
				<IonToolbar>
					<IonTitle>Categorias</IonTitle>

					<IonButtons slot="start" className="ion-padding-start">
						<IonCardSubtitle className="logo">VinoVault</IonCardSubtitle>
					</IonButtons>

					<IonButtons slot="end">
						<IonBadge color="danger">
                            { favourites.length }
                        </IonBadge>
						<IonButton color="danger" routerLink="/favourites">
							<IonIcon icon={ heart } />
						</IonButton>

						<IonBadge color="dark">
                            { shopCart.length }
                        </IonBadge>
						<IonButton color="dark" routerLink="/cart">
							<IonIcon icon={ cart } />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			
			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
					<IonTitle size="large">
						Categories
					</IonTitle>
					</IonToolbar>
				</IonHeader>

				<IonGrid>
					<IonRow>
						{ uniqueCategories.map((category, index) => {

							return (
								<IonCol size="6" key={ `category_list_${ index }`}>
									<IonCard routerLink={ `/category/${ category.slug }`} className="categoryCard">
										
										<img src={ category.cover } alt="category cover" />

										<IonCardContent className="categoryCardContent">
											<IonCardSubtitle>{ category.name }</IonCardSubtitle>
										</IonCardContent>
									</IonCard>
								</IonCol>
							)
						})}
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	);
};

export default Home;