import React from 'react';
import { useTranslation } from 'react-i18next';
import { Beverage } from '../types';
import { Pencil, Wine, Coffee, CupSoda, Droplet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'soda':
      return <CupSoda size={18} />;
    case 'coffee':
      return <Coffee size={18} />;
    case 'tea':
      return <Coffee size={18} />;
    case 'juice':
      return <Wine size={18} />;
    default:
      return <Droplet size={18} />;
  }
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'soda':
      return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
    case 'coffee':
      return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    case 'tea':
      return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'juice':
      return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    case 'energy drink':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    default:
      return 'text-zinc-300 bg-zinc-400/10 border-zinc-400/20';
  }
};

export function BeverageList({
  beverages,
  onEdit,
}: {
  beverages: Beverage[];
  onEdit?: (beverage: Beverage) => void;
}) {
  const { t } = useTranslation();

  if (beverages.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-zinc-900/40 p-16 text-center shadow-sm">
        <Droplet size={48} className="mb-4 text-zinc-500" />
        <p className="text-xl font-medium text-zinc-300">{t('no_beverages')}</p>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">{t('no_beverages_desc')}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid auto-rows-auto grid-cols-1 items-start gap-4 pb-24 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      <AnimatePresence>
        {beverages.map((beverage, index) => {
          const totalSugar = ((beverage.sugarPer100ml / 100) * beverage.volume_ml).toFixed(1);
          const typeStyle = getTypeColor(beverage.type);

          return (
            <motion.div
              key={beverage.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="group relative row-span-5 mb-2 grid grid-rows-subgrid items-start overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/60 transition-colors hover:border-white/10"
            >
              {/* Type Badge */}
              <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
                <div
                  className={`flex w-max items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide ${typeStyle}`}
                >
                  {getTypeIcon(beverage.type)}
                  <span className="truncate">
                    {t(`categories.${beverage.type}`, beverage.type).toUpperCase()}
                  </span>
                </div>
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(beverage)}
                    className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-cyan-500/10 hover:text-cyan-300"
                    title={t('edit_entry')}
                    aria-label={t('edit_entry')}
                  >
                    <Pencil size={16} />
                  </button>
                )}
              </div>

              {/* Title & Brand */}
              <div className="px-5 sm:px-6">
                <div className="mb-1 flex items-center gap-2 pl-1">
                  <h3 className="line-clamp-1 text-xl font-bold text-white" title={beverage.name}>
                    {beverage.name}
                  </h3>
                  {parseFloat(totalSugar) === 0 && (
                    <span className="rounded border border-green-500/30 bg-green-500/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider whitespace-nowrap text-green-400 uppercase">
                      {t('zero')}
                    </span>
                  )}
                  {parseFloat(totalSugar) > 25 && (
                    <span className="rounded border border-red-500/30 bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider whitespace-nowrap text-red-400 uppercase">
                      {t('high_sugar')}
                    </span>
                  )}
                </div>
                <p className="line-clamp-1 pl-1 text-sm text-zinc-400" title={beverage.brand}>
                  {beverage.brand}
                </p>
              </div>

              {/* Stats row */}
              <div className="flex items-end justify-between px-5 pl-7 sm:px-6">
                <div>
                  <p className="mb-0.5 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    {t('per_100ml')}
                  </p>
                  <p className="font-mono text-xl text-zinc-300">
                    {beverage.sugarPer100ml}
                    <span className="ml-0.5 text-sm text-zinc-400">g</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="mb-0.5 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    {t('total_in', { volume: beverage.volume_ml })}
                  </p>
                  <p className="font-mono text-3xl font-bold tracking-tighter text-white">
                    {totalSugar}
                    <span className="ml-0.5 text-sm text-zinc-400">g</span>
                  </p>
                </div>
              </div>

              {/* Progress Bar (Daily Limit) */}
              <div className="flex flex-col justify-start px-5 pt-2 sm:px-6">
                <div className="w-full">
                  <div className="mb-1.5 flex items-center justify-between pl-1">
                    <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                      {t('daily_limit')}
                    </span>
                    <span
                      className={`font-mono text-xs font-bold ${parseFloat(totalSugar) > 25 ? 'text-red-400' : 'text-cyan-400'}`}
                    >
                      {Math.round(((parseFloat(totalSugar) || 0) / 25) * 100)}%
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {Array.from({ length: Math.ceil((parseFloat(totalSugar) || 0) / 25) || 1 }).map(
                      (_, i) => {
                        const percentage = ((parseFloat(totalSugar) || 0) / 25) * 100;
                        const fullBars = Math.floor(percentage / 100);
                        let width = 0;
                        if (i < fullBars) {
                          width = 100;
                        } else if (i === fullBars) {
                          width = percentage % 100;
                        }

                        return (
                          <div
                            key={i}
                            className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800"
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${width}%` }}
                              transition={{
                                delay: index * 0.05 + 0.3 + i * 0.1,
                                duration: 0.8,
                                type: 'spring',
                              }}
                              className={`h-full rounded-full ${parseFloat(totalSugar) > 25 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`}
                            ></motion.div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>

              {/* Sugar Cubes Info */}
              <div className="relative mt-2 flex flex-col justify-start px-5 pb-5 sm:px-6 sm:pb-6">
                <div className="absolute top-0 right-5 left-5 border-t border-white/5 sm:right-6 sm:left-6" />
                <div className="pt-4">
                  <div className="mb-3 flex items-center justify-between pl-1">
                    <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                      {t('sugar_cubes')}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">
                      {Math.round((parseFloat(totalSugar) || 0) / 4)}
                    </span>
                  </div>
                  <div className="flex w-full max-w-full flex-wrap gap-1.5 pl-1">
                    {Array.from({ length: Math.round((parseFloat(totalSugar) || 0) / 4) }).map(
                      (_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.4 + i * 0.01, duration: 0.3 }}
                          className="h-3.5 w-3.5 transform rounded-[2px] bg-white/90 shadow-[1px_1px_2px_rgba(0,0,0,0.5)] transition-transform hover:scale-110"
                          style={{ rotate: `${(Math.random() - 0.5) * 10}deg` }}
                        ></motion.div>
                      ),
                    )}
                    {Math.round((parseFloat(totalSugar) || 0) / 4) === 0 && (
                      <span className="text-[10px] font-bold font-medium tracking-wider text-zinc-400 uppercase">
                        {t('zero')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Decorative background visual for high sugar */}
              {parseFloat(totalSugar) > 40 && (
                <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-red-500/5 blur-2xl transition-colors group-hover:bg-red-500/10"></div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
