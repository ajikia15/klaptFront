import { FC } from 'react';
import { ArrowRight } from '@deemlol/next-icons';
import { useTranslation } from 'react-i18next';

export const SkeletonCard: FC = () => {
  const { t } = useTranslation();
  return (
    <div className="group relative flex flex-col h-full rounded-2xl transition-all duration-300 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 border border-neutral-700/30 overflow-hidden">
      <div className="relative w-full pt-6 pb-4 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent"></div>

        <div className="relative z-10 flex items-center justify-center h-36">
          <div className="h-full w-full bg-neutral-800/70 rounded-md animate-pulse"></div>
        </div>

        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <div className="w-10 h-10 bg-neutral-800/70 rounded-lg animate-pulse"></div>
          <div className="w-10 h-10 bg-neutral-800/70 rounded-lg animate-pulse"></div>
        </div>
      </div>

      <div className="relative flex flex-col flex-grow p-5 bg-neutral-800/60 before:absolute before:top-0 before:left-[10%] before:right-[10%] before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-purple-500/30 before:to-transparent">
        <div className="flex flex-col flex-grow">
          <div className="h-7 w-3/4 bg-neutral-700 rounded-md animate-pulse mb-2"></div>

          <div className="space-y-2 mb-5">
            <div className="h-4 w-full bg-neutral-700 rounded-md animate-pulse"></div>
            <div className="h-4 w-2/3 bg-neutral-700 rounded-md animate-pulse"></div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-700/50">
            <div className="flex flex-col">
              <div className="text-sm text-neutral-400 bg-neutral-700 animate-pulse rounded relative">
                <span className="opacity-0">{t('price')}</span>
              </div>
              <div className="text-purple-300 font-bold bg-purple-600/40 animate-pulse rounded relative">
                <span className="opacity-0">$1,299</span>
              </div>
            </div>

            <div className="relative overflow-hidden bg-secondary-700/50 px-4 py-2 rounded-md text-white text-base font-medium flex items-center gap-1.5 animate-pulse">
              <span className="relative z-10 font-bold opacity-0">
                {t('viewDetails')}
              </span>
              <ArrowRight size={16} className="relative z-10 opacity-0" />
              <div className="absolute inset-0 bg-secondary-700/50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
