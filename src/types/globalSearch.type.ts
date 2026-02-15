export interface SearchProduct {
  id: string;
  productName: string;
  slug: string;
  price: number;
  finalPrice: number;
  image: string;
}

export interface SearchCategory {
  id: string;
  categoryName: string;
  slug: string;
  image?: string | null;
}

export interface SearchUser {
  id: string;
  fullName: string;
  phoneNumber: string;
}

export interface GlobalSearchResult {
  products: SearchProduct[];
  categories: SearchCategory[];
  users: SearchUser[];
}