export interface Brand {
  id: number;
  name: string;
  country: string;
  foundedYear: number;
  websiteUrl: string;
  logoUrl: string | null;
  description: string;
  createdAt?: string;
}
