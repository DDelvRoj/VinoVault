// fetcher.d.ts

import { Product } from './types'; // Ajusta la importación según tu estructura de tipos

declare module "./data/fetcher" {
  export const fetchData: () => Promise<Product[]>;
}
