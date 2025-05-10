import * as React from 'react';
import { createPortal } from 'react-dom';
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

  // Detect mobile (reactively)
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      }}
      aria-modal="true"
      role="dialog"
    >
      {/* Exit icon in top right, always visible */}
      <button
        className="fixed right-6 top-6 z-50 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 focus:outline-none"
        aria-label="Close"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }}
        tabIndex={0}
        type="button"
      >
        <X size={32} />
      </button>
      {/* Carousel arrows outside image, centered vertically, not on mobile */}
      {images && images.length > 1 && !isMobile && (
        <button
          className="fixed left-6 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white hover:bg-black/80 focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
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
      {images && images.length > 1 && !isMobile && (
        <button
          className="fixed right-6 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white hover:bg-black/80 focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
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
      {/* Centered image in a container, only inside is draggable, outside closes */}
      <div
        className="relative flex flex-col items-center justify-center"
        style={{ maxWidth: 'min(98vw, 1600px)', maxHeight: 'min(96vh, 900px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={emblaRef}
          className="flex h-full w-full cursor-grab select-none items-center justify-center overflow-hidden"
          style={{ width: 'min(98vw, 1600px)', height: 'min(80vh, 800px)' }}
        >
          <div className="flex h-full w-full">
            {images && images.length > 0
              ? images.map((img, idx) => (
                  <div
                    className="flex h-full w-full flex-shrink-0 items-center justify-center"
                    key={img + idx}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Image ${idx + 1} of ${images.length}`}
                    style={{
                      width: 'min(98vw, 1600px)',
                      height: 'min(80vh, 800px)',
                    }}
                  >
                    <img
                      src={img}
                      alt={`Gallery image ${idx + 1}`}
                      className="mx-auto h-auto max-h-full w-auto max-w-full rounded-xl object-contain shadow-2xl"
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
      </div>
      {/* Pagination dots and thumbnails outside the image container, bottom center */}
      {images && images.length > 1 && (
        <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
          <div className="flex justify-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${selectedIndex === idx ? 'bg-purple-400 scale-125' : 'bg-neutral-600'}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  emblaApi && emblaApi.scrollTo(idx);
                }}
                aria-label={`Go to image ${idx + 1}`}
                tabIndex={0}
                type="button"
              />
            ))}
          </div>
          <div className="mt-3 flex justify-center gap-2 rounded-lg bg-black/40 px-3 py-2 backdrop-blur-sm">
            {images.map((img, idx) => (
              <button
                key={img + idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  emblaApi && emblaApi.scrollTo(idx);
                }}
                onMouseEnter={() => emblaApi && emblaApi.scrollTo(idx)}
                className={`border-2 rounded-md overflow-hidden transition-all duration-200 focus:outline-none ${selectedIndex === idx ? 'border-purple-400 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                style={{ width: 48, height: 36 }}
                aria-label={`Thumbnail ${idx + 1}`}
                tabIndex={0}
                type="button"
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                  style={{ background: 'transparent' }}
                />
              </button>
            ))}
          </div>
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
