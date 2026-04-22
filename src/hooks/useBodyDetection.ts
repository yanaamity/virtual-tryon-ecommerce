'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { BodyLandmarks } from '@/types';

let cocoSsdModel: any = null;
let tfReady = false;

/**
 * Load TensorFlow.js and Coco-SSD model
 */
async function initializeTensorFlow(): Promise<boolean> {
  if (tfReady && cocoSsdModel) return true;

  try {
    // Dynamically import TensorFlow
    const tf = await import('@tensorflow/tfjs');
    const cocoSsd = await import('@tensorflow-models/coco-ssd');

    // Load the model
    cocoSsdModel = await cocoSsd.load();
    tfReady = true;
    return true;
  } catch (error) {
    console.error('Failed to load TensorFlow model:', error);
    return false;
  }
}

/**
 * Custom hook for detecting body landmarks in an image
 */
export function useBodyDetection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modelInitialized = useRef(false);

  // Initialize TensorFlow on mount
  useEffect(() => {
    const init = async () => {
      if (!modelInitialized.current) {
        const success = await initializeTensorFlow();
        modelInitialized.current = success;
        if (!success) {
          setError('Failed to load body detection model');
        }
      }
    };

    init();
  }, []);

  /**
   * Detect body landmarks in an image
   */
  const detectBody = useCallback(
    async (imageElement: HTMLImageElement): Promise<BodyLandmarks | null> => {
      if (!modelInitialized.current || !cocoSsdModel) {
        setError('Body detection model not initialized');
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Run inference
        const predictions = await cocoSsdModel.estimateObjects(imageElement, {
          maxDetections: 10,
          minScore: 0.3,
        });

        // Find person in predictions
        const person = predictions.find((pred: any) => pred.class === 'person');

        if (!person) {
          setError('No person detected in image');
          return null;
        }

        // Extract bounding box
        const [x, y, width, height] = person.bbox;

        // Estimate body landmarks based on bounding box
        const landmarks: BodyLandmarks = {
          // Shoulder area (top of bounding box)
          shoulderY: y + height * 0.1,

          // Chest center (middle of bounding box)
          chestCenterX: x + width / 2,
          chestCenterY: y + height * 0.3,

          // Shoulder positions
          shoulderLeft: {
            x: x + width * 0.25,
            y: y + height * 0.15,
          },
          shoulderRight: {
            x: x + width * 0.75,
            y: y + height * 0.15,
          },
        };

        setIsLoading(false);
        return landmarks;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Detection failed';
        setError(message);
        setIsLoading(false);
        return null;
      }
    },
    []
  );

  /**
   * Detect body in canvas
   */
  const detectBodyInCanvas = useCallback(
    async (canvas: HTMLCanvasElement): Promise<BodyLandmarks | null> => {
      if (!modelInitialized.current || !cocoSsdModel) {
        setError('Body detection model not initialized');
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Run inference on canvas
        const predictions = await cocoSsdModel.estimateObjects(canvas);

        // Find person in predictions
        const person = predictions.find((pred: any) => pred.class === 'person');

        if (!person) {
          setError('No person detected in image');
          return null;
        }

        // Extract bounding box
        const [x, y, width, height] = person.bbox;

        // Estimate body landmarks
        const landmarks: BodyLandmarks = {
          shoulderY: y + height * 0.1,
          chestCenterX: x + width / 2,
          chestCenterY: y + height * 0.3,
          shoulderLeft: {
            x: x + width * 0.25,
            y: y + height * 0.15,
          },
          shoulderRight: {
            x: x + width * 0.75,
            y: y + height * 0.15,
          },
        };

        setIsLoading(false);
        return landmarks;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Detection failed';
        setError(message);
        setIsLoading(false);
        return null;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    detectBody,
    detectBodyInCanvas,
    isLoading,
    error,
    clearError,
    isReady: modelInitialized.current,
  };
}
