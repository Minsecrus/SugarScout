import React from 'react';
import { useTranslation } from 'react-i18next';
import { Beverage } from '../types';
import { Trash2, Wine, Coffee, CupSoda, Droplet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'soda': return <CupSoda size={18} />;
    case 'coffee': return <Coffee size={18} />;
    case 'tea': return <Coffee size={18} />;
    case 'juice': return <Wine size={18} />;
    default: return <Droplet size={18} />;
  }
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'soda': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
    case 'coffee': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    case 'tea': return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'juice': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    case 'energy drink': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    default: return 'text-zinc-300 bg-zinc-400/10 border-zinc-400/20';
  }
};

export function BeverageList({ beverages, onDelete }: { beverages: Beverage[]; onDelete?: (id: string) => void }) {
  const { t } = useTranslation();

  if (beverages.length === 0) {
    return (
      <div className="bg-zinc-900/40 rounded-3xl border border-white/5 shadow-sm p-16 flex flex-col items-center justify-center text-center mt-8">
        <Droplet size={48} className="text-zinc-500 mb-4" />
        <p className="text-zinc-300 text-xl font-medium">{t('no_beverages')}</p>
        <p className="text-zinc-400 text-sm mt-2 max-w-sm">{t('no_beverages_desc')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-8 pb-24 items-start auto-rows-auto">
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
              className="row-span-5 grid grid-rows-subgrid items-start bg-zinc-900/60 border border-white/5 hover:border-white/10 rounded-3xl transition-colors group relative overflow-hidden mb-2"
            >
              {/* Type Badge */}
              <div className="px-5 sm:px-6 pt-5 sm:pt-6 flex justify-between items-start gap-3">
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 border w-max ${typeStyle}`}>
                  {getTypeIcon(beverage.type)}
                  <span className="truncate">{t(`categories.${beverage.type}`, beverage.type).toUpperCase()}</span>
                </div>
                {beverage.id && onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(beverage.id!)}
                    className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    title={t('delete_entry')}
                    aria-label={t('delete_entry')}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Title & Brand */}
              <div className="px-5 sm:px-6">
                <div className="flex items-center gap-2 mb-1 pl-1">
                  <h3 className="text-xl font-bold text-white line-clamp-1" title={beverage.name}>{beverage.name}</h3>
                  {parseFloat(totalSugar) === 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30 whitespace-nowrap">{t('zero')}</span>
                  )}
                  {parseFloat(totalSugar) > 25 && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 whitespace-nowrap">{t('high_sugar')}</span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 line-clamp-1 pl-1" title={beverage.brand}>{beverage.brand}</p>
              </div>

              {/* Stats row */}
              <div className="px-5 sm:px-6 flex items-end justify-between pl-7">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-0.5">{t('per_100ml')}</p>
                  <p className="text-xl font-mono text-zinc-300">{beverage.sugarPer100ml}<span className="text-sm text-zinc-400 ml-0.5">g</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-0.5">{t('total_in', { volume: beverage.volume_ml })}</p>
                  <p className="text-3xl font-mono font-bold text-white tracking-tighter">{totalSugar}<span className="text-sm text-zinc-400 ml-0.5">g</span></p>
                </div>
              </div>

              {/* Progress Bar (Daily Limit) */}
              <div className="px-5 sm:px-6 flex flex-col justify-start pt-2">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1.5 pl-1">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{t('daily_limit')}</span>
                    <span className={`text-xs font-mono font-bold ${parseFloat(totalSugar) > 25 ? 'text-red-400' : 'text-cyan-400'}`}>
                      {Math.round(((parseFloat(totalSugar) || 0) / 25) * 100)}%
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {Array.from({ length: Math.ceil((parseFloat(totalSugar) || 0) / 25) || 1 }).map((_, i) => {
                      const percentage = ((parseFloat(totalSugar) || 0) / 25) * 100;
                      const fullBars = Math.floor(percentage / 100);
                      let width = 0;
                      if (i < fullBars) {
                        width = 100;
                      } else if (i === fullBars) {
                        width = percentage % 100;
                      }
                      
                      return (
                        <div key={i} className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${width}%` }}
                            transition={{ delay: index * 0.05 + 0.3 + (i * 0.1), duration: 0.8, type: 'spring' }}
                            className={`h-full rounded-full ${parseFloat(totalSugar) > 25 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`}
                          ></motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Sugar Cubes Info */}
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 relative flex flex-col justify-start mt-2">
                <div className="absolute top-0 left-5 sm:left-6 right-5 sm:right-6 border-t border-white/5" />
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-3 pl-1">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">{t('sugar_cubes')}</span>
                    <span className="text-xs font-mono font-bold text-white">{Math.round((parseFloat(totalSugar) || 0) / 4)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 w-full pl-1 max-w-full">
                    {Array.from({ length: Math.round((parseFloat(totalSugar) || 0) / 4) }).map((_, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.4 + (i * 0.01), duration: 0.3 }}
                        className="w-3.5 h-3.5 bg-white/90 rounded-[2px] shadow-[1px_1px_2px_rgba(0,0,0,0.5)] transform hover:scale-110 transition-transform"
                        style={{ rotate: `${(Math.random() - 0.5) * 10}deg` }}
                      ></motion.div>
                    ))}
                    {Math.round((parseFloat(totalSugar) || 0) / 4) === 0 && (
                      <span className="text-[10px] text-zinc-400 font-medium uppercase font-bold tracking-wider">{t('zero')}</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Decorative background visual for high sugar */}
              {parseFloat(totalSugar) > 40 && (
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-500/10 transition-colors"></div>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  );
}
