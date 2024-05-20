// fetcher.d.ts

import { ProductCategory } from './types'; // Ajusta la importación según tu estructura de tipos

declare module "./data/fetcher" {
  export const fetchData: () => Promise<ProductCategory[]>;
}
