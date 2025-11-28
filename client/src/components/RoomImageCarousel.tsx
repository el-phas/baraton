import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoomImage {
  id: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}

interface RoomImageCarouselProps {
  images: RoomImage[];
  fallbackImageUrl?: string;
  className?: string;
}

const RoomImageCarousel: React.FC<RoomImageCarouselProps> = ({ 
  images, 
  fallbackImageUrl, 
  className = "" 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Use images if available, otherwise fallback to single image
  const displayImages = images && images.length > 0 
    ? images.sort((a, b) => a.display_order - b.display_order)
    : fallbackImageUrl 
    ? [{ id: 'fallback', image_url: fallbackImageUrl, alt_text: 'Room image', display_order: 0, is_primary: true }]
    : [];

  if (displayImages.length === 0) {
    return (
      <div className={`relative w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main image */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden">
        <img
          src={displayImages[currentIndex].image_url}
          alt={displayImages[currentIndex].alt_text || 'Room image'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        {/* Navigation arrows - only show if more than one image */}
        {displayImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {/* Image counter */}
        {displayImages.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>
      
      {/* Thumbnail dots - only show if more than one image */}
      {displayImages.length > 1 && (
        <div className="flex justify-center mt-3 space-x-2">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomImageCarousel;