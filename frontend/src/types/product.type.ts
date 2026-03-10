export interface Product {
    id: number;
    name: string;
    subTitle: string;
    price: string;
    oldPrice?: string;
    discount?: number;
    isNew?: boolean;
    image: string;
  }
  