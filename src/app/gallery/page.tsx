'use client';

import { useState, useEffect } from 'react';
import { Trash2, Download, Eye } from 'lucide-react';
import { getSavedLooks, deleteLook } from '@/utils/api';
import { SavedLook } from '@/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/utils/constants';

export default function GalleryPage() {
  const [looks, setLooks] = useState<SavedLook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedLook, setSelectedLook] = useState<SavedLook | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<SavedLook[]>([]);

  // Fetch looks on mount
  useEffect(() => {
    const fetchLooks = async () => {
      try {
        setIsLoading(true);
        const data = await getSavedLooks();
        setLooks(data);
      } catch (err) {
        setError('Failed to load saved looks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLooks();
  }, []);

  // Handle delete
  const handleDelete = async (lookId: string) => {
    if (!window.confirm('Delete this look permanently?')) return;

    try {
      const success = await deleteLook(lookId);
      if (success) {
        setLooks(looks.filter((l) => l.id !== lookId));
        setSuccess(SUCCESS_MESSAGES.DELETE_SUCCESS);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(ERROR_MESSAGES.DELETE_FAILED);
      }
    } catch (err) {
      setError(ERROR_MESSAGES.DELETE_FAILED);
    }
  };

  // Handle download
  const handleDownload = (look: SavedLook) => {
    const link = document.createElement('a');
    link.href = look.compositeImageUrl;
    link.download = `look-${look.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle compare toggle
  const handleToggleCompare = (look: SavedLook) => {
    const isSelected = selectedForCompare.find((l) => l.id === look.id);
    if (isSelected) {
      setSelectedForCompare(selectedForCompare.filter((l) => l.id !== look.id));
    } else if (selectedForCompare.length < 4) {
      setSelectedForCompare([...selectedForCompare, look]);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="spinner mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your saved looks...</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">Your Saved Looks</h1>
        <p className="section-subtitle">
          View, compare, and download your favorite virtual try-ons
        </p>
      </div>

      {/* Messages */}
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

      {/* Empty State */}
      {looks.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📸</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No saved looks yet
          </h2>
          <p className="text-gray-600 mb-6">
            Visit the Try-On Studio to create and save your first virtual look!
          </p>
          <a href="/tryon" className="btn btn-primary">
            Start Try-On
          </a>
        </div>
      ) : (
        <>
          {/* Compare Controls */}
          {looks.length > 1 && (
            <div className="mb-6 flex gap-4 items-center">
              <button
                onClick={() => {
                  setCompareMode(!compareMode);
                  setSelectedForCompare([]);
                }}
                className={`btn ${compareMode ? 'btn-accent' : 'btn-ghost'}`}
              >
                {compareMode ? '✓ Compare Mode ON' : 'Compare Looks'}
              </button>
              {compareMode && selectedForCompare.length > 0 && (
                <>
                  <span className="text-sm text-gray-600">
                    Selected: {selectedForCompare.length}/4
                  </span>
                  {selectedForCompare.length > 1 && (
                    <button
                      onClick={() => setSelectedForCompare([])}
                      className="btn btn-ghost text-sm"
                    >
                      Clear Selection
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Grid */}
          <div className="grid-auto">
            {looks.map((look) => (
              <div
                key={look.id}
                className={`card relative overflow-hidden transition-all ${
                  compareMode &&
                  selectedForCompare.find((l) => l.id === look.id)
                    ? 'ring-2 ring-blue-500'
                    : ''
                }`}
              >
                {/* Image */}
                <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100 h-48">
                  <img
                    src={look.compositeImageUrl}
                    alt={look.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-product.png';
                    }}
                  />

                  {/* Compare Checkbox */}
                  {compareMode && (
                    <div className="absolute top-2 right-2">
                      <input
                        type="checkbox"
                        checked={!!selectedForCompare.find(
                          (l) => l.id === look.id
                        )}
                        onChange={() => handleToggleCompare(look)}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Details */}
                <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                  {look.productName}
                </h3>

                <p className="text-sm text-gray-600 mb-3">
                  {new Date(look.timestamp).toLocaleDateString()}
                </p>

                {/* Badge */}
                <div className="mb-4">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {look.visualizationMode === 'simple'
                      ? 'Manual Mode'
                      : 'Smart Mode'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => setSelectedLook(look)}
                    className="flex-1 btn btn-ghost text-sm flex items-center justify-center gap-1"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={() => handleDownload(look)}
                    className="flex-1 btn btn-ghost text-sm flex items-center justify-center gap-1"
                  >
                    <Download size={16} /> Download
                  </button>
                  <button
                    onClick={() => handleDelete(look.id)}
                    className="btn btn-ghost text-sm flex items-center justify-center gap-1 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Compare Modal */}
          {compareMode && selectedForCompare.length > 1 && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Compare Looks</h2>
                    <button
                      onClick={() => setCompareMode(false)}
                      className="text-gray-600 hover:text-gray-900 text-2xl"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedForCompare.map((look) => (
                      <div key={look.id} className="space-y-2">
                        <img
                          src={look.compositeImageUrl}
                          alt={look.productName}
                          className="w-full rounded-lg"
                        />
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {look.productName}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {new Date(look.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Modal */}
          {selectedLook && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                      {selectedLook.productName}
                    </h2>
                    <button
                      onClick={() => setSelectedLook(null)}
                      className="text-gray-600 hover:text-gray-900 text-2xl"
                    >
                      ✕
                    </button>
                  </div>

                  <img
                    src={selectedLook.compositeImageUrl}
                    alt={selectedLook.productName}
                    className="w-full rounded-lg mb-4"
                  />

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <p className="text-gray-600">Mode</p>
                      <p className="font-semibold">
                        {selectedLook.visualizationMode === 'simple'
                          ? 'Manual'
                          : 'Smart'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="font-semibold">
                        {new Date(selectedLook.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Scale</p>
                      <p className="font-semibold">
                        {(selectedLook.positioning.scale * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Opacity</p>
                      <p className="font-semibold">
                        {(selectedLook.positioning.opacity * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleDownload(selectedLook);
                      setSelectedLook(null);
                    }}
                    className="w-full btn btn-primary"
                  >
                    Download This Look
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
