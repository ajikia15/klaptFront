import * as React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

interface ImageGalleryDialogProps {
  images?: string[];
  trigger: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ImageGalleryDialog: React.FC<ImageGalleryDialogProps> = ({
  images,
  trigger,
  fallback,
}) => {
  const [open, setOpen] = React.useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    skipSnaps: false,
    loop: true,
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = React.useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = React.useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  React.useEffect(() => {
    if (!open) return;
    // Disable scroll on body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  // Portal root for modal
  const [portalRoot, setPortalRoot] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      aria-modal="true"
      role="dialog"
    >
      {/* Exit icon in top right, always visible */}
      <button
        className="fixed right-6 top-6 z-50 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 focus:outline-none"
        aria-label="Close"
        onClick={() => setOpen(false)}
        tabIndex={0}
        type="button"
      >
        <X size={32} />
      </button>
      {/* Carousel arrows outside image, centered vertically */}
      {images && images.length > 1 && (
        <button
          className="fixed left-6 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white hover:bg-black/80 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            scrollPrev();
          }}
          aria-label="Previous image"
          tabIndex={0}
          type="button"
        >
          <ChevronLeft size={40} />
        </button>
      )}
      {images && images.length > 1 && (
        <button
          className="fixed right-6 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white hover:bg-black/80 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            scrollNext();
          }}
          aria-label="Next image"
          tabIndex={0}
          type="button"
        >
          <ChevronRight size={40} />
        </button>
      )}
      {/* Centered image, not cramped, no extra divs, show full image, but max size */}
      <div
        ref={emblaRef}
        className="flex h-full w-full cursor-grab select-none items-center justify-center overflow-hidden"
        style={{ maxWidth: '100vw', maxHeight: '100vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex h-full w-full"
          style={{ width: '100vw', height: '100vh' }}
        >
          {images && images.length > 0
            ? images.map((img, idx) => (
                <div
                  className="flex h-full w-full flex-shrink-0 items-center justify-center"
                  key={img + idx}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Image ${idx + 1} of ${images.length}`}
                  style={{ width: '100vw', height: '100vh' }}
                >
                  <img
                    src={img}
                    alt={`Gallery image ${idx + 1}`}
                    className="mx-auto h-auto max-h-[80vh] w-auto max-w-[90vw] rounded-xl object-contain shadow-2xl"
                    draggable={false}
                    style={{ background: 'transparent' }}
                  />
                </div>
              ))
            : fallback || (
                <div className="flex flex-col items-center justify-center p-8 text-neutral-400">
                  <span>No images available</span>
                </div>
              )}
        </div>
      </div>
      {/* Pagination dots, bottom center */}
      {images && images.length > 1 && (
        <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${selectedIndex === idx ? 'bg-purple-400 scale-125' : 'bg-neutral-600'}`}
              onClick={(e) => {
                e.stopPropagation();
                emblaApi && emblaApi.scrollTo(idx);
              }}
              aria-label={`Go to image ${idx + 1}`}
              tabIndex={0}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <span onClick={(e) => e.stopPropagation()}>
        {React.isValidElement(trigger)
          ? React.cloneElement(trigger as React.ReactElement<any>, {
              onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                setOpen(true);
                const orig = (
                  trigger as React.ReactElement & { props?: { onClick?: any } }
                ).props?.onClick;
                if (typeof orig === 'function') orig(e);
              },
            })
          : trigger}
      </span>
      {open && portalRoot && createPortal(modal, portalRoot)}
    </>
  );
};

export default ImageGalleryDialog;
