import { Store } from "pullstate";

interface CartStoreState {
  total: number;
  product_ids: string[];
}

export const CartStore = new Store<CartStoreState>({
  total: 0,
  product_ids: []
});

export const addToCart = ( productID: string): void => {
  CartStore.update(s => {
    s.product_ids = [...s.product_ids, `${productID}`];
  });
}

export const removeFromCart = (productID: string): void => {
  CartStore.update(s => {
    s.product_ids = s.product_ids.filter(p=>p!=productID);
  });
}
