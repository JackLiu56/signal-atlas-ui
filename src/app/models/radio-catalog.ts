export interface RadioModelSummary {
  id: number;

  brandId: number;
  brandName: string;

  modelName: string;
  modelNumber: string;

  category: string;
  frequencyBand: string;

  frequencyRange: string;
  digitalProtocol: string;

  releaseYear: number;
  discontinuedYear: number;

  estimatedMarketLow: number;
  estimatedMarketHigh: number;

  imageUrl: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CatalogQuery {
  q?: string;
  category?: string;
  frequencyBand?: string;
  digitalProtocol?: string;
  releaseYearFrom?: number;
  releaseYearTo?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: string;
}
