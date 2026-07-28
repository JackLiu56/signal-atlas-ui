export interface RadioModelRequest {
  brandId: number | null;

  modelName: string;
  modelNumber: string;

  category: string;
  frequencyBand: string;

  frequencyRange: string;
  modulation: string;
  digitalProtocol: string;

  releaseYear: number | null;
  discontinuedYear: number | null;

  estimatedMarketLow: number | null;
  estimatedMarketHigh: number | null;

  description: string;
  imageUrl: string;
}
