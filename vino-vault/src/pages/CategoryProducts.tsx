import { IonBadge, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonNote, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react";
import {useParams} from 'react-router-dom'
import { cart, chevronBackOutline, searchOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/ProductCard.tsx";

import { CartStore } from "../data/CartStore.ts";
import { ProductStore } from "../data/ProductStore.ts";

import "./CategoryProducts.css";
import { Product, ProductCategory } from "../data/types.ts";
import React from "react";

const CategoryProducts : React.FC = () => {

    const params= useParams() as ProductCategory;
    const cartRef = useRef<HTMLIonIconElement>(null);
    const products = ProductStore.useState(s => s.products);
    const shopCart = CartStore.useState(s => s.product_ids);
    const [ category, setCategory ] = useState<ProductCategory>({});
    const [ searchResults, setsearchResults ] = useState<Product[]>([]);
    const [ amountLoaded, setAmountLoaded ] = useState(6);

    useEffect(() => {

        const categorySlug = params.slug;
        const tempCategory = products.filter(p => p.slug === categorySlug)[0];
        console.log(categorySlug);
        
        if(tempCategory.products!==undefined){
            setCategory(tempCategory);
            setsearchResults(tempCategory.products);
        }
    }, [ params.slug]);

    const fetchMore = async (e:any) => {

		//	Increment the amount loaded by 6 for the next iteration
		setAmountLoaded(prevAmount => (prevAmount + 6));
		e.target.complete();
	}

    const search = async (e:React.KeyboardEvent<HTMLIonSearchbarElement>) => {

        const searchVal = e.currentTarget.value;

        if (searchVal !== "") {
         
            const tempResults :Product[]|undefined= category.products?.filter(p => p.name?.toLowerCase().includes((searchVal?searchVal.toLowerCase():'')));
            if (tempResults!==undefined){
                setsearchResults(tempResults);
            }
        } else {

            if(category.products!==undefined){
                setsearchResults(category.products);
            }

                
        }
    }

    return (

        <IonPage id="category-page" className="categoryPage">
            <IonHeader>
				<IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color="dark" title={ category.name } routerLink="/" routerDirection="back">
                            <IonIcon color="dark" icon={ chevronBackOutline } />&nbsp;Categorias
                        </IonButton>
                    </IonButtons>
					<IonTitle>{ category && category.name }</IonTitle>

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

                <IonSearchbar className="search" onKeyUp={ search } placeholder="Try 'high back'" searchIcon={ searchOutline } animated={ true } />

                <IonGrid>

                    <IonRow className="ion-text-center">
                        <IonCol size="12">
                            <IonNote>{ searchResults && searchResults.length } { (searchResults.length > 1 || searchResults.length === 0) ? " products" : " product" } found</IonNote>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        { searchResults && searchResults.map((product, index) => {

                            if ((index <= amountLoaded) && product.image) {
                                return (
                                    <ProductCard key={ `category_product_${ index }`} product={ product } index={ index } cartRef={ cartRef } category={ category } />
                                );
                            }
                            return null;
                        }).filter(o=>o!=null)
                        }
                    </IonRow>
                </IonGrid>

                <IonInfiniteScroll threshold="100px" onIonInfinite={ fetchMore }>
					<IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Fetching more...">
					</IonInfiniteScrollContent>
				</IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );
}

export default CategoryProducts;