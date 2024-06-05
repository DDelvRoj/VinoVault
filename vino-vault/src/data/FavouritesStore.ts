import { Store } from "pullstate";

interface FavouritesStoreState {
  total: number;
  product_ids: string[];
}

export const FavouritesStore = new Store<FavouritesStoreState>({
  total: 0,
  product_ids: []
});


export const addToFavourites = (productID: number): void => {
  FavouritesStore.update(s => {
    const productId = productID.toString();
    const existingIndex = s.product_ids.findIndex(id => id === productId);
    if (existingIndex !== -1) {
      s.product_ids.splice(existingIndex, 1);
    } else {
      s.product_ids.push(productId);
    }
  });
}
