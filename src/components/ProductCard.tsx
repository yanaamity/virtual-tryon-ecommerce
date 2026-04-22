'use client';

import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onClick: (product: Product) => void;
}

export default function ProductCard({
  product,
  isSelected,
  onClick,
}: ProductCardProps) {
  return (
    <button
      onClick={() => onClick(product)}
      className={`card text-left transition-all cursor-pointer ${
        isSelected
          ? 'ring-2 ring-blue-500 shadow-lg scale-105'
          : 'hover:shadow-lg'
      }`}
    >
      <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100 h-40">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-product.png';
          }}
        />
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <div className="bg-blue-500 text-white rounded-full p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 line-clamp-2">
        {product.name}
      </h3>

      <p className="text-sm text-gray-600 mb-2">{product.category}</p>

      <div className="flex items-center justify-between">
        <span className="font-bold text-lg text-gray-900">
          {product.price}
        </span>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {product.color}
        </span>
      </div>

      {product.sizes && product.sizes.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-500 mb-2">Sizes available:</p>
          <div className="flex flex-wrap gap-1">
            {product.sizes.slice(0, 3).map((size) => (
              <span
                key={size}
                className="text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 3 && (
              <span className="text-xs text-gray-500 self-center">
                +{product.sizes.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
    </button>
  );
}
