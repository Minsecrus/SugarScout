import { useTranslation } from 'react-i18next';
import { RangeFilter } from './RangeFilter';

type RangeFilterPanelProps = {
  clearRangeFilters: () => void;
  applyQuickFilter: (filter: QuickFilterKey) => void;
  hasRangeFilters: boolean;
  setSugarMax: (value: string) => void;
  setSugarMin: (value: string) => void;
  setTotalSugarMax: (value: string) => void;
  setTotalSugarMin: (value: string) => void;
  setVolumeMax: (value: string) => void;
  setVolumeMin: (value: string) => void;
  sugarMax: string;
  sugarMin: string;
  totalSugarMax: string;
  totalSugarMin: string;
  volumeMax: string;
  volumeMin: string;
  onDone: () => void;
};

export type QuickFilterKey = 'zero' | 'low' | 'moderate' | 'high' | 'large';

const QUICK_FILTERS: QuickFilterKey[] = ['zero', 'low', 'moderate', 'high', 'large'];

export function RangeFilterPanel({
  applyQuickFilter,
  clearRangeFilters,
  hasRangeFilters,
  setSugarMax,
  setSugarMin,
  setTotalSugarMax,
  setTotalSugarMin,
  setVolumeMax,
  setVolumeMin,
  sugarMax,
  sugarMin,
  totalSugarMax,
  totalSugarMin,
  volumeMax,
  volumeMin,
  onDone,
}: RangeFilterPanelProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-6 pr-8">
      <div>
        <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] font-bold mb-3">{t('filter_label')}</p>
        <h2 className="text-2xl font-bold text-white">{t('range_filters')}</h2>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">{t('quick_filters')}</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => applyQuickFilter(filter)}
              className="rounded-full border border-white/10 bg-zinc-950/50 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-cyan-400/50 hover:text-white"
            >
              {t(`quick_filter_${filter}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <RangeFilter
          label={t('filter_sugar')}
          minLabel={t('min')}
          maxLabel={t('max')}
          minValue={sugarMin}
          maxValue={sugarMax}
          onMinChange={setSugarMin}
          onMaxChange={setSugarMax}
          step="0.1"
        />
        <RangeFilter
          label={t('filter_volume')}
          minLabel={t('min')}
          maxLabel={t('max')}
          minValue={volumeMin}
          maxValue={volumeMax}
          onMinChange={setVolumeMin}
          onMaxChange={setVolumeMax}
        />
        <RangeFilter
          label={t('filter_total_sugar')}
          minLabel={t('min')}
          maxLabel={t('max')}
          minValue={totalSugarMin}
          maxValue={totalSugarMax}
          onMinChange={setTotalSugarMin}
          onMaxChange={setTotalSugarMax}
          step="0.1"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {hasRangeFilters && (
          <button
            type="button"
            onClick={clearRangeFilters}
            className="rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
          >
            {t('clear_ranges')}
          </button>
        )}
        <button
          type="button"
          onClick={onDone}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
        >
          {t('done')}
        </button>
      </div>
    </section>
  );
}
