import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';

// Mock database - in production use real database
let mockProducts: Map<string, Product> = new Map();

/**
 * GET /api/products/[id] - Get single product
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // In production, fetch from database
    // For now, return sample product
    const sampleProduct: Product = {
      id: productId,
      name: 'Sample Product',
      category: 'tops',
      imageUrl: '/products/sample.png',
      description: 'Sample product description',
      price: '$29.99',
      sizes: ['S', 'M', 'L'],
      color: 'Blue',
      recommendedPosition: { x: 0, y: 0.2, scale: 1.0 },
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: sampleProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[id] - Update product (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const productId = params.id;
    const body = await request.json();

    // In production, update database
    const updatedProduct: Product = {
      id: productId,
      name: body.name || 'Updated Product',
      category: body.category || 'tops',
      imageUrl: body.imageUrl || '/products/sample.png',
      description: body.description || '',
      price: body.price || '$0.00',
      sizes: body.sizes || [],
      color: body.color || '',
      recommendedPosition: body.recommendedPosition || {
        x: 0,
        y: 0.2,
        scale: 1.0,
      },
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update product',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id] - Delete product (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const productId = params.id;

    // In production, delete from database
    // mockProducts.delete(productId);

    return NextResponse.json(
      {
        success: true,
        message: 'Product deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete product',
      },
      { status: 500 }
    );
  }
}
