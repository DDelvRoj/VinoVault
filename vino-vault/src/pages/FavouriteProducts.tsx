import { IonBadge, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonNote, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { cart, chevronBackOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/ProductCard.tsx";
import { CartStore } from "../data/CartStore.ts";
import { FavouritesStore } from "../data/FavouritesStore.ts";
import { ProductStore } from "../data/ProductStore.ts";
import React from "react";
import { Producto } from "../data/types.ts";




const FavouriteProducts : React.FC = () => {

    const cartRef = useRef<HTMLIonIconElement>(null);
    const products = ProductStore.useState(s => s.products);
    const favourites = FavouritesStore.useState(s => s.product_ids);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ searchResults, setSearchResults ] = useState<Producto[]>([]);
    const [ amountLoaded, setAmountLoaded ] = useState(6);

    useEffect(()=>{
        setSearchResults([]);
        const getFavoritos = ()=>{
            favourites.forEach(f=>{
                const productosFavoritos = products.filter(p=>p.id_producto===f)[0];
                setSearchResults(previo=>[...previo,productosFavoritos]);
            });
        }
        getFavoritos();
    },[favourites]);
    const fetchMore = async (e:any) => {
        console.log('Me deslizoo');
        
		//	Increment the amount loaded by 6 for the next iteration
		setAmountLoaded(prevAmount => (prevAmount + 6));
		e.target.complete();
	}

    return (

        <IonPage id="category-page" className="categoryPage">
            <IonHeader>
				<IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color="dark" routerLink="/" routerDirection="back">
                            <IonIcon color="dark" icon={ chevronBackOutline } />&nbsp;Ver Productos
                        </IonButton>
                    </IonButtons>
					<IonTitle>Favoritos</IonTitle>

                    <IonButtons slot="end">
                        <IonBadge color="dark">
                            { shopCart.length }
                        </IonBadge>
						<IonButton color="dark" routerLink="/cart">
							<IonIcon ref={ cartRef } className="animate__animated" icon={ cart } />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			
			<IonContent fullscreen>
                <IonGrid>

                    <IonRow className="ion-text-center">
                        <IonCol size="12">
                            <IonNote>{ searchResults && searchResults.length } { (searchResults.length > 1 || searchResults.length === 0) ? " favoritos encontrados" : " favorito encontrado" }</IonNote>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        { searchResults && searchResults.map((product, index) => {

                            if ((index <= amountLoaded)) {
                                return (
                                    <ProductCard key={ `producto_${ index }`} product={ product } index={ index } cartRef={ cartRef }  />
                                );
                            }
                            return null;
                        }).filter(p=>p!=null)}
                    </IonRow>
                </IonGrid>

                <IonInfiniteScroll threshold="100px" onIonInfinite={ fetchMore }>
					<IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Cargando más...">
					</IonInfiniteScrollContent>
				</IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );
}

export default FavouriteProducts;