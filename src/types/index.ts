// Product Types
export interface ProductVariant {
  variantId: string;
  size: string;
  color: string;
  style: string;
  imageUrl: string;
  scaleFactor: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'outerwear' | 'dresses' | 'accessories';
  imageUrl: string;
  description: string;
  price: string;
  sizes: string[];
  color: string;
  variants?: ProductVariant[];
  recommendedPosition: {
    x: number;
    y: number;
    scale: number;
  };
  createdAt: string;
}

// User Look Types
export interface Position {
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

export interface SavedLook {
  id: string;
  userId: string;
  timestamp: string;
  userPhotoUrl: string;
  productId: string;
  productName: string;
  visualizationMode: 'simple' | 'smart';
  positioning: Position;
  compositeImageUrl: string;
}

// Visualization Types
export type VisualizationMode = 'simple' | 'smart';

export interface BodyLandmarks {
  shoulderY: number;
  chestCenterX: number;
  chestCenterY: number;
  shoulderLeft?: { x: number; y: number };
  shoulderRight?: { x: number; y: number };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadPhotoResponse extends ApiResponse<{
  imageUrl: string;
  imageId: string;
}> {}

export interface ProductsResponse extends ApiResponse<{
  products: Product[];
}> {}

export interface SaveLookResponse extends ApiResponse<{
  lookId: string;
  lookUrl: string;
}> {}

// File Upload Types
export interface FileWithPreview extends File {
  preview?: string;
}
