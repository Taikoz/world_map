import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CarouselProps {
  images: string[];
  className?: string;
}

export default function Carousel({ images, className = "" }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-800/50 to-blue-900/50 border border-cyan-500/20">
        <div className="relative w-full h-full">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-scale-down transition-all duration-500 ease-in-out aspect-square"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-400/60 transition-all duration-300 group"
            >
              <div>
                <ChevronLeft  className="w-5 h-5 text-cyan-300 group-hover:text-white transition-colors duration-300"/>
              </div>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-400/60 transition-all duration-300 group"
            >
              <div>
                <ChevronRight className="w-5 h-5 text-cyan-300 group-hover:text-white transition-colors duration-300" />
              </div>
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30">
            <span className="text-xs font-medium text-cyan-300">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-6 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 shadow-lg shadow-cyan-500/50"
                  : "w-2 h-2 bg-slate-600 hover:bg-cyan-500/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
