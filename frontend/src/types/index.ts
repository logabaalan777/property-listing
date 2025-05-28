export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Property {
  id: string;
  title: string;
  type: string;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  furnished: "Unfurnished" | "Semi-Furnished" | "Furnished";
  availableFrom: string;
  listedBy: string;
  tags: string[];
  colorTheme: string;
  rating: number;
  isVerified: boolean;
  listingType: "sale" | "rent";
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  images?: string[];
}

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  property: Property;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  fromUserId: string;
  toUserId: string;
  propertyId: string;
  property: Property;
  fromUserEmail?: string;
  message?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export type FilterOptions = {
  type?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  amenities?: string[];
  furnished?: string;
  listingType?: string;
  tags?: string[];
  sortBy?: string;
  listedBy?: string;
  page?: number;
  limit?: number;
}