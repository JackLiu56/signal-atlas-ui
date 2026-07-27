export interface RadioSpecResponse {
  id: number;
  specName: string;
  specValue: string;
  unit: string;
  category: string;
  displayOrder: number;
  createdAt: string;
}

export interface RadioModelDetail {
  id: number;

  brandId: number;
  brandName: string;
  brandCountry: string;

  modelName: string;
  modelNumber: string;

  category: string;
  frequencyBand: string;

  frequencyRange: string;
  modulation: string;
  digitalProtocol: string;

  releaseYear: number;
  discontinuedYear: number;

  estimatedMarketLow: number;
  estimatedMarketHigh: number;

  description: string;
  imageUrl: string;

  createdAt: string;

  specs: RadioSpecResponse[];
}
