import {
  ApiResponse,
  UploadPhotoResponse,
  ProductsResponse,
  SaveLookResponse,
  Product,
  SavedLook,
} from '@/types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Upload user photo
 */
export async function uploadUserPhoto(file: File): Promise<UploadPhotoResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}/api/upload-user-photo`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload photo');
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Get all products
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/api/products`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data: ProductsResponse = await response.json();
    return data.data?.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Get single product
 */
export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/api/products/${productId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data: ApiResponse<Product> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Save a look
 */
export async function saveLook(payload: {
  userPhotoId: string;
  productId: string;
  visualizationMode: 'simple' | 'smart';
  positioning: {
    x: number;
    y: number;
    scale: number;
    opacity: number;
  };
  compositeImageBase64: string;
}): Promise<SaveLookResponse> {
  try {
    const response = await fetch(`${API_URL}/api/looks/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to save look');
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Save failed',
    };
  }
}

/**
 * Get all saved looks
 */
export async function getSavedLooks(userId?: string): Promise<SavedLook[]> {
  try {
    const url = new URL(`${API_URL}/api/looks`);
    if (userId) {
      url.searchParams.append('userId', userId);
    }

    const response = await fetch(url.toString(), {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch looks');
    }

    const data: ApiResponse<SavedLook[]> = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching looks:', error);
    return [];
  }
}

/**
 * Get specific look
 */
export async function getLook(lookId: string): Promise<SavedLook | null> {
  try {
    const response = await fetch(`${API_URL}/api/looks/${lookId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch look');
    }

    const data: ApiResponse<SavedLook> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching look:', error);
    return null;
  }
}

/**
 * Delete look
 */
export async function deleteLook(lookId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/looks/${lookId}`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting look:', error);
    return false;
  }
}

/**
 * Create product (admin)
 */
export async function createProduct(
  formData: FormData,
  adminPassword: string
): Promise<ApiResponse<Product>> {
  try {
    const response = await fetch(`${API_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminPassword}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Creation failed',
    };
  }
}

/**
 * Update product (admin)
 */
export async function updateProduct(
  productId: string,
  payload: Partial<Product>,
  adminPassword: string
): Promise<ApiResponse<Product>> {
  try {
    const response = await fetch(`${API_URL}/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminPassword}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Update failed',
    };
  }
}

/**
 * Delete product (admin)
 */
export async function deleteProduct(
  productId: string,
  adminPassword: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/admin/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminPassword}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}
