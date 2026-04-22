'use client';

import { useState, useEffect } from 'react';
import { Download, Save, RotateCw } from 'lucide-react';
import PhotoUpload from '@/components/PhotoUpload';
import ProductGrid from '@/components/ProductGrid';
import CompositeCanvas from '@/components/CompositeCanvas';
import PositionControls from '@/components/PositionControls';
import { getProducts, saveLook, uploadUserPhoto } from '@/utils/api';
import { canvasToBase64, downloadCanvasAsImage } from '@/utils/imageComposition';
import { Product, Position, BodyLandmarks, VisualizationMode } from '@/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, DEFAULT_POSITION } from '@/utils/constants';
import { useRef } from 'react';

export default function TryOnPage() {
  // State
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [userPhotoFile, setUserPhotoFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariantUrl, setSelectedVariantUrl] = useState<string | null>(null);
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION);
  const [mode, setMode] = useState<VisualizationMode>('simple');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      const prods = await getProducts();
      setProducts(prods);
    };
    fetchProducts();
  }, []);

  // Handle photo upload
  const handlePhotoSelected = async (file: File, preview: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, use local preview
      // In production, upload to Vercel Blob Storage
      setUserPhotoFile(file);
      setUserPhotoUrl(preview);
      setSuccess(SUCCESS_MESSAGES.UPLOAD_SUCCESS);

      // Reset selections
      setSelectedProduct(null);
      setPosition(DEFAULT_POSITION);
    } catch (err) {
      setError(ERROR_MESSAGES.UPLOAD_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle mode toggle
  const handleModeChange = () => {
    setMode(mode === 'simple' ? 'smart' : 'simple');
    setPosition(DEFAULT_POSITION); // Reset position when changing modes
  };

  // Handle save look
  const handleSaveLook = async () => {
    if (!userPhotoUrl || !selectedProduct || !canvasRef.current) {
      setError('Please upload a photo and select a product first');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const compositeImage = canvasToBase64(canvasRef.current);

      const response = await saveLook({
        userPhotoId: 'anonymous-' + Date.now(),
        productId: selectedProduct.id,
        visualizationMode: mode,
        positioning: position,
        compositeImageBase64: compositeImage,
      });

      if (response.success) {
        setSuccess(SUCCESS_MESSAGES.SAVE_SUCCESS);
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.error || ERROR_MESSAGES.SAVE_FAILED);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.SAVE_FAILED);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (canvasRef.current) {
      downloadCanvasAsImage(
        canvasRef.current,
        `tryon-${selectedProduct?.name.replace(/\s+/g, '-')}-${Date.now()}.png`
      );
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="section-title">Virtual Try-On Studio</h1>
        <p className="section-subtitle">
          Upload your photo, select clothing, and see how it looks on you
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-emerald-700">{success}</p>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel - Photo Upload */}
        <div className="lg:col-span-1">
          <PhotoUpload
            onPhotoSelected={handlePhotoSelected}
            isLoading={isLoading}
          />
        </div>

        {/* Center Panel - Canvas */}
        <div className="lg:col-span-1 space-y-6">
          {userPhotoUrl ? (
            <>
              {/* Mode Toggle */}
              <div className="card">
                <h3 className="font-semibold mb-3">Visualization Mode</h3>
                <button
                  onClick={handleModeChange}
                  className="w-full btn btn-secondary flex items-center justify-center gap-2"
                >
                  <RotateCw size={18} />
                  Switch to {mode === 'simple' ? 'Smart' : 'Manual'} Mode
                </button>
              </div>

              {/* Canvas */}
              {selectedProduct ? (
                <CompositeCanvas
                  ref={canvasRef}
                  userPhotoUrl={userPhotoUrl}
                  product={selectedProduct}
                  productVariantUrl={selectedVariantUrl}
                  mode={mode}
                  position={position}
                  onPositionChange={setPosition}
                />
              ) : (
                <div className="card flex items-center justify-center h-96 bg-gray-100">
                  <div className="text-center">
                    <p className="text-gray-600 font-medium">
                      Select a product to try on
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedProduct && (
                <div className="space-y-2">
                  <button
                    onClick={handleSaveLook}
                    disabled={isSaving}
                    className="w-full btn btn-accent flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save This Look'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="w-full btn btn-ghost flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download Image
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="card flex items-center justify-center h-96 bg-gray-100">
              <div className="text-center">
                <p className="text-gray-600 font-medium">
                  Upload a photo to get started
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Product Grid */}
        <div className="lg:col-span-1">
          <ProductGrid
            products={products}
            selectedProduct={selectedProduct}
            onProductSelect={(product) => {
              setSelectedProduct(product);
              setSelectedVariantUrl(null);
              setPosition(DEFAULT_POSITION);
            }}
            isLoading={products.length === 0}
          />
        </div>
      </div>

      {/* Position Controls - Below all when product selected */}
      {selectedProduct && userPhotoUrl && (
        <div className="mt-8">
          <PositionControls
            position={position}
            onPositionChange={setPosition}
            mode={mode}
            canvasWidth={800}
          />
        </div>
      )}
    </div>
  );
}
