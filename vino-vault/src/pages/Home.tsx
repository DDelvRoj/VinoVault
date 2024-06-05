import { IonBadge, IonButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonFabList, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonNote, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react";
import { add, cart, heart, personCircleOutline, searchOutline, settingsOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/ProductCard.tsx";

import { CartStore } from "../data/CartStore.ts";
import { RealProductStore } from "../data/ProductStore.ts";

import "./Home.css";
import { Product } from "../data/types.ts";
import React from "react";
import { FavouritesStore } from "../data/FavouritesStore.ts";

const Home : React.FC = () => {

    const cartRef = useRef<HTMLIonIconElement>(null);
    const products = RealProductStore.useState(s=>s.products);
    const favoritos = FavouritesStore.useState(s=>s.product_ids);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ searchResults, setsearchResults ] = useState<Product[]>([]);
    const [ amountLoaded, setAmountLoaded ] = useState(6);

    useEffect(() => {
        
        
        if(amountLoaded>=0){
            
            const productosTop = products?.map((p,i)=>{
                if(i<=amountLoaded){
                    return p;
                }
                return null
            }).filter(p=>p!=null);
            setsearchResults(productosTop);
        }
    }, [amountLoaded]);

    const fetchMore = async (e:any) => {

		//	Increment the amount loaded by 6 for the next iteration
		setAmountLoaded(prevAmount => (prevAmount + 6));
		e.target.complete();
	}

    const search = async (e:React.KeyboardEvent<HTMLIonSearchbarElement>) => {

        const searchVal = e.currentTarget.value;

        if (searchVal !== "") {
         
            const tempResults :Product[]|undefined= products?.filter(p => p.name?.toLowerCase().includes((searchVal?searchVal.toLowerCase():'')));
            if (tempResults!==undefined){
                setsearchResults(tempResults);
            }
        }
    }

    return (

        <IonPage id="category-page" className="categoryPage">
            <IonHeader>
				<IonToolbar>
                    
					<IonTitle>Productos</IonTitle>
                    
                    <IonButtons slot="end">
						<IonBadge color="danger">
                            { favoritos.length }
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

                <IonSearchbar className="search" onKeyUp={ search } placeholder="Intenta con 'Vino'" searchIcon={ searchOutline } animated={ true } />

                <IonGrid>

                    <IonRow className="ion-text-center">
                        <IonCol size="12">
                            <IonNote>{ (searchResults && searchResults.length) } { (searchResults.length > 1 || searchResults.length === 0) ? " productos encontrados." : " producto encontrado." } </IonNote>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        { searchResults && searchResults.map((product, index) => {

                            if ((index <= amountLoaded) && product.image) {
                                return (
                                    <ProductCard key={ `producto_${ index }`} product={ product } index={ index } cartRef={ cartRef }  />
                                );
                            }
                            return null;
                        }).filter(o=>o!=null)
                        }
                    </IonRow>
                </IonGrid>

                <IonInfiniteScroll threshold="100px" onIonInfinite={ fetchMore }>
					<IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Cargando más..."/>
				</IonInfiniteScroll>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton color="dark">
                        <IonIcon icon={settingsOutline} />
                    </IonFabButton>
                    <IonFabList side="top">
                        <IonFabButton color="dark" routerLink="/registrar-producto">
                            <IonIcon icon={add} />
                        </IonFabButton>
                        <IonFabButton color="dark" routerLink="/ajustes-usuario">
                            <IonIcon icon={personCircleOutline} />
                        </IonFabButton>
                    </IonFabList>
                </IonFab>
            </IonContent>
            
        </IonPage>
    );
}

export default Home;