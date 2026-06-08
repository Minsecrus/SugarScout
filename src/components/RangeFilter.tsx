type RangeFilterProps = {
  label: string;
  maxLabel: string;
  minLabel: string;
  maxValue: string;
  minValue: string;
  onMaxChange: (value: string) => void;
  onMinChange: (value: string) => void;
  step?: string;
};

export function RangeFilter({
  label,
  maxLabel,
  minLabel,
  maxValue,
  minValue,
  onMaxChange,
  onMinChange,
  step = '1',
}: RangeFilterProps) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          min="0"
          step={step}
          value={minValue}
          onChange={(event) => onMinChange(event.target.value)}
          className="min-w-0 rounded-lg border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-white transition-colors outline-none placeholder:text-zinc-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          placeholder={minLabel}
          aria-label={`${label} ${minLabel}`}
        />
        <input
          type="number"
          min="0"
          step={step}
          value={maxValue}
          onChange={(event) => onMaxChange(event.target.value)}
          className="min-w-0 rounded-lg border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-white transition-colors outline-none placeholder:text-zinc-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          placeholder={maxLabel}
          aria-label={`${label} ${maxLabel}`}
        />
      </div>
    </div>
  );
}
