// Canvas settings
export const CANVAS_MAX_WIDTH = 800;
export const CANVAS_MAX_HEIGHT = 600;

// Image upload settings
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Position controls
export const MIN_SCALE = 0.5;
export const MAX_SCALE = 2.0;
export const SCALE_STEP = 0.1;

export const MIN_OPACITY = 0.3;
export const MAX_OPACITY = 1.0;
export const OPACITY_STEP = 0.05;

export const DRAG_SENSITIVITY = 1;

// Visualization modes
export const VISUALIZATION_MODES = {
  SIMPLE: 'simple',
  SMART: 'smart',
} as const;

// Body detection settings (TensorFlow.js)
export const COCO_SSD_CONFIG = {
  maxDetections: 10,
  minScore: 0.3,
};

// Product categories
export const PRODUCT_CATEGORIES = [
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'accessories', label: 'Accessories' },
] as const;

// Size options
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

// Default positioning for products
export const DEFAULT_POSITION = {
  x: 0,
  y: 0,
  scale: 1.0,
  opacity: 0.9,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  LAST_UPLOAD: 'vto_last_upload',
  USER_ID: 'vto_user_id',
  SAVED_LOOKS: 'vto_saved_looks',
  ADMIN_SESSION: 'vto_admin_session',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UPLOAD_FAILED: 'Failed to upload photo. Please try again.',
  FILE_TOO_LARGE: 'File size exceeds maximum limit (10MB).',
  INVALID_FILE_TYPE: 'Please upload a JPEG, PNG, or WebP image.',
  PRODUCT_NOT_FOUND: 'Product not found.',
  SAVE_FAILED: 'Failed to save look. Please try again.',
  DELETE_FAILED: 'Failed to delete. Please try again.',
  AUTH_FAILED: 'Invalid admin credentials.',
  DETECTION_FAILED: 'Failed to detect body. Using simple mode instead.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: 'Photo uploaded successfully!',
  SAVE_SUCCESS: 'Look saved successfully!',
  DELETE_SUCCESS: 'Deleted successfully!',
  PRODUCT_CREATED: 'Product created successfully!',
  PRODUCT_UPDATED: 'Product updated successfully!',
} as const;
