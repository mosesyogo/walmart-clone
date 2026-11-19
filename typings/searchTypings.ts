export interface Product {
  product_id?: string;
  title: string;
  url?: string;
  image?: string;
  price?: number;
  currency?: string;
  rating?: number;
  reviews_count?: number;
  badge?: string;
}

export interface ProductDetail {
  url: string;
  title: string;
  description: string;
  price?: number;
  currency: string;
  images: string[];
  breadcrumbs: string[];
  rating?: {
    rating: number;
    count: number;
  };
  specifications: {
    key: string;
    value: string;
  }[];
}
export interface ParsedContent {
  total_results?: number;
  products?: Product[];
}

export interface SearchResult {
  results: { json?: ParsedContent }[];
}