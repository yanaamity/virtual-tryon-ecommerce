'use client';

import { useRef, useEffect, useState, useCallback, forwardRef, Ref } from 'react';
import { Position, BodyLandmarks, VisualizationMode, Product } from '@/types';
import {
  drawSimpleOverlay,
  drawSmartOverlay,
  loadImage,
  resizeCanvasToImage,
} from '@/utils/imageComposition';
import { useBodyDetection } from '@/hooks/useBodyDetection';
import { CANVAS_MAX_WIDTH, CANVAS_MAX_HEIGHT, ERROR_MESSAGES } from '@/utils/constants';

interface CompositeCanvasProps {
  userPhotoUrl: string;
  product: Product | null;
  productVariantUrl?: string;
  mode: VisualizationMode;
  position: Position;
  onPositionChange: (position: Position) => void;
  onLandmarksDetected?: (landmarks: BodyLandmarks) => void;
}

const CompositeCanvas = forwardRef(function CompositeCanvasComponent(
  {
    userPhotoUrl,
    product,
    productVariantUrl,
    mode,
    position,
    onPositionChange,
    onLandmarksDetected,
  }: CompositeCanvasProps,
  ref: Ref<HTMLCanvasElement>
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userImageRef = useRef<HTMLImageElement | null>(null);
  const clothingImageRef = useRef<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [landmarks, setLandmarks] = useState<BodyLandmarks | null>(null);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  const { detectBody } = useBodyDetection();

  // Sync ref
  useEffect(() => {
    if (ref && canvasRef.current) {
      if (typeof ref === 'function') {
        ref(canvasRef.current);
      } else {
        ref.current = canvasRef.current;
      }
    }
  }, [ref]);

  // Load user photo
  useEffect(() => {
    const loadUserPhoto = async () => {
      try {
        const img = await loadImage(userPhotoUrl);
        userImageRef.current = img;

        if (canvasRef.current) {
          resizeCanvasToImage(
            canvasRef.current,
            img,
            CANVAS_MAX_WIDTH,
            CANVAS_MAX_HEIGHT
          );

          // Detect body if in smart mode
          if (mode === 'smart') {
            detectBody(img).then((detectedLandmarks) => {
              if (detectedLandmarks) {
                setLandmarks(detectedLandmarks);
                setDetectionError(null);
                onLandmarksDetected?.(detectedLandmarks);
              } else {
                setDetectionError(ERROR_MESSAGES.DETECTION_FAILED);
              }
            });
          }
        }
      } catch (error) {
        console.error('Failed to load user photo:', error);
      }
    };

    if (userPhotoUrl) {
      loadUserPhoto();
    }
  }, [userPhotoUrl, mode, detectBody, onLandmarksDetected]);

  // Load clothing image
  useEffect(() => {
    const loadClothing = async () => {
      try {
        const imageUrl = productVariantUrl || product?.imageUrl;
        if (imageUrl) {
          const img = await loadImage(imageUrl);
          clothingImageRef.current = img;
        }
      } catch (error) {
        console.error('Failed to load clothing image:', error);
      }
    };

    if (product) {
      loadClothing();
    }
  }, [product, productVariantUrl]);

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !userImageRef.current || !clothingImageRef.current) return;

    try {
      if (mode === 'simple') {
        drawSimpleOverlay(
          canvas,
          userImageRef.current,
          clothingImageRef.current,
          position
        );
      } else if (mode === 'smart' && landmarks) {
        drawSmartOverlay(
          canvas,
          userImageRef.current,
          clothingImageRef.current,
          landmarks,
          position
        );
      }
    } catch (error) {
      console.error('Drawing error:', error);
    }
  }, [mode, position, landmarks]);

  // Redraw on changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'simple') return; // Only drag in simple mode

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDrawing(true);
    setDragStart({
      x: e.clientX - rect.left - position.x,
      y: e.clientY - rect.top - position.y,
    });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mode !== 'simple') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = e.clientX - rect.left - dragStart.x;
    const newY = e.clientY - rect.top - dragStart.y;

    onPositionChange({
      ...position,
      x: newX,
      y: newY,
    });
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Preview</h3>
        <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
          Mode: {mode === 'simple' ? 'Manual' : 'Smart'}
        </span>
      </div>

      <div className="flex-center overflow-x-auto bg-gray-100 rounded-lg">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={mode === 'simple' ? 'cursor-move' : 'cursor-default'}
          style={{
            maxWidth: '100%',
            height: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>

      {detectionError && mode === 'smart' && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">{detectionError}</p>
          <p className="text-xs text-yellow-600 mt-1">
            Adjust manually or switch to manual mode for better control.
          </p>
        </div>
      )}

      {mode === 'simple' && (
        <div className="text-sm text-gray-600 text-center">
          💡 Drag clothing to reposition • Use sliders below to adjust
        </div>
      )}

      {mode === 'smart' && landmarks && (
        <div className="text-sm text-gray-600 text-center">
          ✨ Smart positioning activated • Fine-tune with sliders below
        </div>
      )}
    </div>
  );
});

export default CompositeCanvas;
