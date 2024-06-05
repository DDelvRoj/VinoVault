import { Store } from "pullstate";
import { CartStoreState } from "./types";



export const CartStore = new Store<CartStoreState>({
  total: 0,
  product_ids: []
});

export const addToCart = ( productID: number): void => {
  CartStore.update(s => {
    s.product_ids = [...s.product_ids, `${productID}`];
  });
}

export const removeFromCart = (productIndex: number): void => {
  CartStore.update(s => {
    s.product_ids.splice(productIndex, 1);
  });
}
