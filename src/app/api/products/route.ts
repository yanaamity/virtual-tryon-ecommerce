import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Sample product data - in production, use a real database
const sampleProducts: Product[] = [
  {
    id: 'product-001',
    name: 'Classic Blue T-Shirt',
    category: 'tops',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%234A90E2" width="200" height="300"/%3E%3Crect fill="%23FFFFFF" x="40" y="60" width="120" height="140"/%3E%3Crect fill="%234A90E2" x="10" y="40" width="60" height="80"/%3E%3Crect fill="%234A90E2" x="130" y="40" width="60" height="80"/%3E%3Ctext x="100" y="160" text-anchor="middle" font-size="14" fill="%234A90E2" font-family="Arial"%3EBlue Tee%3C/text%3E%3C/svg%3E',
    description: 'Comfortable cotton t-shirt, perfect for everyday wear',
    price: '$19.99',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    color: 'Blue',
    recommendedPosition: { x: 0, y: 0.2, scale: 1.0 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-002',
    name: 'Black Hoodie',
    category: 'tops',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%23000000" width="200" height="300"/%3E%3Crect fill="%23333333" x="30" y="80" width="140" height="160"/%3E%3Ccircle cx="100" cy="100" r="30" fill="%23000000"/%3E%3Crect fill="%23000000" x="20" y="40" width="60" height="100"/%3E%3Crect fill="%23000000" x="120" y="40" width="60" height="100"/%3E%3Ctext x="100" y="180" text-anchor="middle" font-size="14" fill="%23FFFFFF" font-family="Arial"%3EBlack Hoodie%3C/text%3E%3C/svg%3E',
    description: 'Cozy hoodie for cooler days',
    price: '$49.99',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Black',
    recommendedPosition: { x: 0, y: 0.1, scale: 1.1 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-003',
    name: 'Denim Jacket',
    category: 'outerwear',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%234169E1" width="200" height="300"/%3E%3Crect fill="%235B7BC4" x="40" y="50" width="50" height="160"/%3E%3Crect fill="%235B7BC4" x="110" y="50" width="50" height="160"/%3E%3Crect fill="%234169E1" x="70" y="80" width="60" height="120"/%3E%3Crect fill="%23000000" x="45" y="60" width="4" height="140"/%3E%3Crect fill="%23000000" x="151" y="60" width="4" height="140"/%3E%3Ctext x="100" y="240" text-anchor="middle" font-size="14" fill="%23FFFFFF" font-family="Arial"%3EDenim Jacket%3C/text%3E%3C/svg%3E',
    description: 'Classic denim jacket, timeless style',
    price: '$79.99',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    color: 'Blue',
    recommendedPosition: { x: 0, y: 0, scale: 1.2 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-004',
    name: 'Red Dress',
    category: 'dresses',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%23E74C3C" width="200" height="300"/%3E%3Cpolygon points="100,50 150,100 140,300 60,300 50,100" fill="%23C0392B"/%3E%3Crect fill="%23E74C3C" x="30" y="40" width="60" height="80"/%3E%3Crect fill="%23E74C3C" x="110" y="40" width="60" height="80"/%3E%3Ctext x="100" y="160" text-anchor="middle" font-size="14" fill="%23FFFFFF" font-family="Arial"%3ERed Dress%3C/text%3E%3C/svg%3E',
    description: 'Elegant red dress for special occasions',
    price: '$69.99',
    sizes: ['XS', 'S', 'M', 'L'],
    color: 'Red',
    recommendedPosition: { x: 0, y: 0.15, scale: 0.95 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-005',
    name: 'White Polo Shirt',
    category: 'tops',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%23FFFFFF" width="200" height="300"/%3E%3Crect fill="%23F5F5F5" x="40" y="60" width="120" height="140"/%3E%3Crect fill="%23000000" x="90" y="60" width="20" height="30"/%3E%3Crect fill="%23CCCCCC" x="10" y="40" width="60" height="80"/%3E%3Crect fill="%23CCCCCC" x="130" y="40" width="60" height="80"/%3E%3Ctext x="100" y="220" text-anchor="middle" font-size="14" fill="%23000000" font-family="Arial"%3EWhite Polo%3C/text%3E%3C/svg%3E',
    description: 'Classic white polo shirt for a professional look',
    price: '$29.99',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'White',
    recommendedPosition: { x: 0, y: 0.2, scale: 1.0 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'product-006',
    name: 'Leather Jacket',
    category: 'outerwear',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%23333333" width="200" height="300"/%3E%3Crect fill="%23000000" x="35" y="50" width="130" height="180"/%3E%3Crect fill="%23333333" x="20" y="40" width="60" height="100"/%3E%3Crect fill="%23333333" x="120" y="40" width="60" height="100"/%3E%3Crect fill="%23444444" x="80" y="80" width="8" height="100"/%3E%3Crect fill="%23444444" x="112" y="80" width="8" height="100"/%3E%3Ctext x="100" y="250" text-anchor="middle" font-size="14" fill="%23FFFFFF" font-family="Arial"%3ELeather Jacket%3C/text%3E%3C/svg%3E',
    description: 'Stylish black leather jacket',
    price: '$129.99',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    color: 'Black',
    recommendedPosition: { x: 0, y: 0, scale: 1.15 },
    createdAt: new Date().toISOString(),
  },
];

/**
 * GET /api/products - Get all products
 */
export async function GET(request: NextRequest) {
  try {
    // In production, fetch from database
    // For now, return sample data
    return NextResponse.json(
      {
        success: true,
        data: {
          products: sampleProducts,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products - Create new product (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authorization
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!token || token !== adminPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const price = formData.get('price') as string;
    const color = formData.get('color') as string;
    const description = formData.get('description') as string;
    const sizes = JSON.parse(formData.get('sizes') as string || '[]');
    const file = formData.get('file') as File;

    if (!name || !category || !price || !file) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // In production, upload to Vercel Blob Storage
    // For MVP, create a placeholder image path
    const imageUrl = `/products/product-${uuidv4()}.png`;

    const newProduct: Product = {
      id: `product-${uuidv4()}`,
      name,
      category: category as any,
      imageUrl,
      description,
      price,
      sizes,
      color,
      recommendedPosition: { x: 0, y: 0.2, scale: 1.0 },
      createdAt: new Date().toISOString(),
    };

    // In production, save to database
    // sampleProducts.push(newProduct);

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product',
      },
      { status: 500 }
    );
  }
}
