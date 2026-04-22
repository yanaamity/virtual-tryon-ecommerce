'use client';

import { useState } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { PRODUCT_CATEGORIES } from '@/utils/constants';

interface ProductGridProps {
  products: Product[];
  selectedProduct: Product | null;
  onProductSelect: (product: Product) => void;
  isLoading?: boolean;
}

export default function ProductGrid({
  products,
  selectedProduct,
  onProductSelect,
  isLoading = false,
}: ProductGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter products by category
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Browse Products</h3>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Items
          </button>
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid-auto">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProduct?.id === product.id}
              onClick={onProductSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found in this category.
          </p>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Browse all products
          </button>
        </div>
      )}

      {/* Count Info */}
      <div className="text-sm text-gray-600 text-center">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
