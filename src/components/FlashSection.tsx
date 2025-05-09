import useEmblaCarousel from 'embla-carousel-react';
import './emblaflashcards.css';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@deemlol/next-icons';
import { FlashCard } from './FlashCard';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

export default function FlashSection() {
  const { t } = useTranslation();

  const flashDeals = [
    {
      title: t('gamingLaptops'),
      discount: 30,
      image: '/images/placeholder-gaming.jpg',
    },
    {
      title: t('businessLaptops'),
      discount: 25,
      image: '/images/placeholder-business.jpg',
    },
    {
      title: t('studentLaptops'),
      discount: 20,
      image: '/images/placeholder-student.jpg',
    },
    {
      title: t('workstationLaptops'),
      discount: 15,
      image: '/images/placeholder-workstation.jpg',
    },
    {
      title: t('creativeWorkstations'),
      discount: 10,
      image: '/images/placeholder-creative.jpg',
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: false,
    containScroll: 'trimSnaps',
    align: 'start',
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative py-8">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {flashDeals.map((deal, index) => (
            <div
              key={index}
              className="group relative min-w-0 flex-[0_0_280px]"
            >
              <FlashCard
                title={deal.title}
                discount={deal.discount}
                image={deal.image}
              />
            </div>
          ))}
        </div>
      </div>

      {prevBtnEnabled && (
        <Button
          className="absolute left-0 top-1/2 -translate-y-1/2 transform rounded-full border border-neutral-700 bg-neutral-800 p-2 transition-opacity hover:bg-neutral-700"
          onClick={scrollPrev}
          aria-label={t('scrollPrev')}
        >
          <ArrowLeft size={24} className="text-white" />
        </Button>
      )}

      {nextBtnEnabled && (
        <Button
          className="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full border border-neutral-700 bg-neutral-800 p-2 transition-opacity hover:bg-neutral-700"
          onClick={scrollNext}
          aria-label={t('scrollNext')}
        >
          <ArrowRight size={24} className="text-white" />
        </Button>
      )}
    </div>
  );
}
