import { createSelector } from 'reselect';

const getState = (state: any) => state;

//  General getters
export const getCart = createSelector(getState, state => state.cart);
export const getCategories = createSelector(getState, state => state.categories);
export const getProducts = createSelector(getState, state => state.products);

//  Specific getters
export const getProduct = (id: string) => createSelector(getState, state => state.products.filter((p: { id: string; }) => parseInt(p.id) === parseInt(id))[0]);
export const getCategoryProducts = (category: any) => createSelector(getState, state => state.products.filter((p: { category: any; }) => p.category === category));