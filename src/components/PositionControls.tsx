'use client';

import { Position, VisualizationMode } from '@/types';
import { MIN_SCALE, MAX_SCALE, MIN_OPACITY, MAX_OPACITY } from '@/utils/constants';

interface PositionControlsProps {
  position: Position;
  onPositionChange: (position: Position) => void;
  mode: VisualizationMode;
  canvasWidth?: number;
}

export default function PositionControls({
  position,
  onPositionChange,
  mode,
  canvasWidth = 800,
}: PositionControlsProps) {
  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newX = parseFloat(e.target.value);
    onPositionChange({ ...position, x: newX });
  };

  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newY = parseFloat(e.target.value);
    onPositionChange({ ...position, y: newY });
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    onPositionChange({ ...position, scale: newScale });
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(e.target.value);
    onPositionChange({ ...position, opacity: newOpacity });
  };

  const handleReset = () => {
    onPositionChange({
      x: 0,
      y: 0,
      scale: 1.0,
      opacity: 0.9,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Adjust Positioning</h3>
        <button
          onClick={handleReset}
          className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full transition"
        >
          Reset
        </button>
      </div>

      {/* Horizontal Position */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Horizontal Position
          </label>
          <span className="text-sm text-gray-500">{Math.round(position.x)}px</span>
        </div>
        <input
          type="range"
          min={-canvasWidth / 2}
          max={canvasWidth / 2}
          step="1"
          value={position.x}
          onChange={handleXChange}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Move clothing left or right
        </p>
      </div>

      {/* Vertical Position */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Vertical Position
          </label>
          <span className="text-sm text-gray-500">{Math.round(position.y)}px</span>
        </div>
        <input
          type="range"
          min={-300}
          max={300}
          step="1"
          value={position.y}
          onChange={handleYChange}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Move clothing up or down
        </p>
      </div>

      {/* Scale */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Size (Scale)
          </label>
          <span className="text-sm text-gray-500">
            {(position.scale * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min={MIN_SCALE}
          max={MAX_SCALE}
          step="0.1"
          value={position.scale}
          onChange={handleScaleChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Smaller</span>
          <span>Larger</span>
        </div>
      </div>

      {/* Opacity */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Opacity
          </label>
          <span className="text-sm text-gray-500">
            {(position.opacity * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min={MIN_OPACITY}
          max={MAX_OPACITY}
          step="0.05"
          value={position.opacity}
          onChange={handleOpacityChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Transparent</span>
          <span>Opaque</span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          {mode === 'simple'
            ? '🎯 Manual Mode: Use sliders to position clothing exactly where you want it.'
            : '✨ Smart Mode: Clothing is auto-positioned on your body. Fine-tune with sliders if needed.'}
        </p>
      </div>
    </div>
  );
}
