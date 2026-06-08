import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BeverageForm } from './components/BeverageForm';
import { BeverageList } from './components/BeverageList';
import { InfoPanel } from './components/InfoPanel';
import { Modal } from './components/Modal';
import { QuickFilterKey, RangeFilterPanel } from './components/RangeFilterPanel';
import { Beverage } from './types';
import { BeverageInsert, isSupabaseConfigured, supabase } from './lib/supabase';
import {
  Download,
  Plus,
  Search,
  Droplets,
  Globe,
  ArrowUpDown,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = ['All', 'Soda', 'Juice', 'Coffee', 'Tea', 'Energy Drink', 'Other'];

const INITIAL_DATA: Beverage[] = [
  {
    id: '1',
    name: 'Original Cola',
    brand: 'Coca-Cola',
    sugarPer100ml: 10.6,
    volume_ml: 330,
    type: 'Soda',
  },
  {
    id: '2',
    name: 'Fresh Orange Juice',
    brand: 'Tropicana',
    sugarPer100ml: 9.0,
    volume_ml: 250,
    type: 'Juice',
  },
  {
    id: '3',
    name: 'Monster Energy',
    brand: 'Monster',
    sugarPer100ml: 11.0,
    volume_ml: 500,
    type: 'Energy Drink',
  },
];

const isInsideRange = (value: number, min: string, max: string) => {
  const minNumber = min === '' ? null : Number(min);
  const maxNumber = max === '' ? null : Number(max);

  if (minNumber !== null && value < minNumber) {
    return false;
  }

  if (maxNumber !== null && value > maxNumber) {
    return false;
  }

  return true;
};

const csvEscape = (value: string | number | undefined) => {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
};

export default function App() {
  const { t, i18n } = useTranslation();
  const [beverages, setBeverages] = useState<Beverage[]>(INITIAL_DATA);
  const [loadingBeverages, setLoadingBeverages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name_asc');
  const [sugarMin, setSugarMin] = useState('');
  const [sugarMax, setSugarMax] = useState('');
  const [volumeMin, setVolumeMin] = useState('');
  const [volumeMax, setVolumeMax] = useState('');
  const [totalSugarMin, setTotalSugarMin] = useState('');
  const [totalSugarMax, setTotalSugarMax] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingBeverage, setEditingBeverage] = useState<Beverage | null>(null);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const loadBeverages = async () => {
      setLoadingBeverages(true);
      const { data, error } = await supabase
        .from('beverages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        alert(t('load_failed'));
      } else {
        setBeverages(data ?? []);
      }

      setLoadingBeverages(false);
    };

    loadBeverages();
  }, [t]);

  const handleAddBeverage = async (beverage: BeverageInsert) => {
    if (!supabase) {
      const newBeverage: Beverage = {
        ...beverage,
        id: Math.random().toString(36).substring(7),
      };
      setBeverages((prev) => [newBeverage, ...prev]);
      setIsFormOpen(false);
      return;
    }

    const { data, error } = await supabase.from('beverages').insert(beverage).select().single();

    if (error) {
      console.error(error);
      throw new Error(t('add_failed'));
    }

    setBeverages((prev) => [data, ...prev]);
    setIsFormOpen(false);
  };

  const handleUpdateBeverage = async (beverage: BeverageInsert) => {
    if (!editingBeverage?.id) {
      return;
    }

    if (!supabase) {
      setBeverages((prev) =>
        prev.map((item) => (item.id === editingBeverage.id ? { ...item, ...beverage } : item)),
      );
      setEditingBeverage(null);
      return;
    }

    const { data, error } = await supabase
      .from('beverages')
      .update(beverage)
      .eq('id', editingBeverage.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw new Error(t('update_failed'));
    }

    setBeverages((prev) => prev.map((item) => (item.id === editingBeverage.id ? data : item)));
    setEditingBeverage(null);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  };

  const clearRangeFilters = () => {
    setSugarMin('');
    setSugarMax('');
    setVolumeMin('');
    setVolumeMax('');
    setTotalSugarMin('');
    setTotalSugarMax('');
  };

  const applyQuickFilter = (filter: QuickFilterKey) => {
    clearRangeFilters();

    switch (filter) {
      case 'zero':
        setSugarMin('0');
        setSugarMax('0');
        break;
      case 'low':
        setTotalSugarMin('0');
        setTotalSugarMax('12.5');
        break;
      case 'moderate':
        setTotalSugarMin('12.5');
        setTotalSugarMax('25');
        break;
      case 'high':
        setTotalSugarMin('25');
        break;
      case 'large':
        setVolumeMin('500');
        break;
    }
  };

  const hasRangeFilters = Boolean(
    sugarMin || sugarMax || volumeMin || volumeMax || totalSugarMin || totalSugarMax,
  );

  const downloadCsv = () => {
    const rows = filteredBeverages.map((beverage) => {
      const totalSugar = ((beverage.sugarPer100ml / 100) * beverage.volume_ml).toFixed(1);
      return [
        beverage.id,
        beverage.name,
        beverage.brand,
        beverage.type,
        beverage.sugarPer100ml,
        beverage.volume_ml,
        totalSugar,
        beverage.created_at,
      ]
        .map(csvEscape)
        .join(',');
    });
    const csv = [
      [
        'id',
        'name',
        'brand',
        'type',
        'sugar_per_100ml',
        'volume_ml',
        'total_sugar_g',
        'created_at',
      ].join(','),
      ...rows,
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sugarscout-beverages.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredBeverages = useMemo(() => {
    let result = beverages.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || b.type === selectedCategory;
      const totalSugar = (b.sugarPer100ml / 100) * b.volume_ml;
      const matchesSugar = isInsideRange(b.sugarPer100ml, sugarMin, sugarMax);
      const matchesVolume = isInsideRange(b.volume_ml, volumeMin, volumeMax);
      const matchesTotalSugar = isInsideRange(totalSugar, totalSugarMin, totalSugarMax);

      return matchesSearch && matchesCategory && matchesSugar && matchesVolume && matchesTotalSugar;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'sugar_asc':
          return a.sugarPer100ml - b.sugarPer100ml;
        case 'sugar_desc':
          return b.sugarPer100ml - a.sugarPer100ml;
        case 'volume_asc':
          return a.volume_ml - b.volume_ml;
        case 'volume_desc':
          return b.volume_ml - a.volume_ml;
        default:
          return 0;
      }
    });

    return result;
  }, [
    beverages,
    searchTerm,
    selectedCategory,
    sortBy,
    sugarMin,
    sugarMax,
    volumeMin,
    volumeMax,
    totalSugarMin,
    totalSugarMax,
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0B] font-sans text-[#E4E4E7] selection:bg-cyan-500/30">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <Droplets size={16} className="text-black" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              {t('title')}
              <span className="font-extrabold text-cyan-400">{t('subtitle')}</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-zinc-700"
            >
              <Globe size={16} />
              <span>{i18n.language === 'zh' ? 'EN' : '中'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsInfoOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-white transition-all hover:border-white/20 hover:bg-zinc-700"
              aria-label={t('open_info')}
              title={t('open_info')}
            >
              <Info size={17} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-12 sm:px-8">
        {/* Hero Section */}
        <div className="mb-12 w-full">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl"
          >
            {t('hero_title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 max-w-2xl text-lg text-zinc-300"
          >
            {t('hero_desc')}
          </motion.p>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="relative w-full md:max-w-md">
                <Search
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-zinc-400"
                  size={18}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border border-white/10 bg-zinc-900/80 py-3.5 pr-6 pl-12 text-[#E4E4E7] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  placeholder={t('search_placeholder')}
                />
              </div>

              <div className="flex w-full min-w-0 gap-3 md:w-auto md:shrink-0">
                <button
                  type="button"
                  onClick={downloadCsv}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-900/80 text-white transition-colors hover:border-white/20 hover:bg-zinc-800"
                  aria-label={t('download_csv')}
                  title={t('download_csv')}
                >
                  <Download size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(true)}
                  className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    hasRangeFilters
                      ? 'border-cyan-500 bg-cyan-500 text-black'
                      : 'border-white/10 bg-zinc-900/80 text-white hover:border-white/20 hover:bg-zinc-800'
                  }`}
                  aria-label={t('range_filters')}
                  title={t('range_filters')}
                >
                  <SlidersHorizontal size={16} />
                  {hasRangeFilters && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-black/60 ring-2 ring-cyan-500" />
                  )}
                </button>

                <div className="flex h-12 min-w-0 flex-1 overflow-hidden rounded-full border border-white/10 bg-zinc-900/80 text-sm md:w-[300px] md:flex-none lg:w-[330px]">
                  <div className="flex shrink-0 items-center border-r border-white/10 px-3 font-medium text-zinc-300 sm:px-4">
                    <ArrowUpDown size={16} className="sm:mr-2" />
                    <span className="hidden sm:inline">{t('sort_by')}</span>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent px-3 py-3 text-white outline-none sm:px-4 md:min-w-[190px]"
                  >
                    <option value="name_asc" className="bg-zinc-900">
                      {t('name_asc')}
                    </option>
                    <option value="name_desc" className="bg-zinc-900">
                      {t('name_desc')}
                    </option>
                    <option value="sugar_asc" className="bg-zinc-900">
                      {t('sugar_asc')}
                    </option>
                    <option value="sugar_desc" className="bg-zinc-900">
                      {t('sugar_desc')}
                    </option>
                    <option value="volume_asc" className="bg-zinc-900">
                      {t('volume_asc')}
                    </option>
                    <option value="volume_desc" className="bg-zinc-900">
                      {t('volume_desc')}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'border border-cyan-500 bg-cyan-500 text-black'
                      : 'border border-white/5 bg-zinc-900/50 text-zinc-300 hover:border-white/20'
                  }`}
                >
                  {t(`categories.${category}`, category)}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="w-full">
          {loadingBeverages ? (
            <div className="mt-8 rounded-3xl border border-white/5 bg-zinc-900/40 p-12 text-center text-zinc-300">
              {t('loading_beverages')}
            </div>
          ) : (
            <BeverageList beverages={filteredBeverages} onEdit={setEditingBeverage} />
          )}
        </div>
      </main>

      {/* Floating Action Button for Add */}
      {!isFormOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="fixed right-8 bottom-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-black shadow-[0_0_30px_rgba(34,211,238,0.4)]"
          title={t('add_beverage')}
        >
          <Plus size={28} />
        </motion.button>
      )}

      {/* Add Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <Modal closeLabel={t('close_modal')} onClose={() => setIsFormOpen(false)}>
            <BeverageForm onAdded={handleAddBeverage} />
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingBeverage && (
          <Modal closeLabel={t('close_modal')} onClose={() => setEditingBeverage(null)}>
            <BeverageForm
              initialValues={editingBeverage}
              onAdded={handleUpdateBeverage}
              submitLabel={t('save_changes')}
              title={t('edit_beverage')}
            />
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInfoOpen && (
          <Modal
            closeLabel={t('close_modal')}
            maxWidthClass="max-w-lg"
            onClose={() => setIsInfoOpen(false)}
          >
            <InfoPanel />
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isFilterOpen && (
          <Modal
            closeLabel={t('close_modal')}
            maxWidthClass="max-w-lg"
            onClose={() => setIsFilterOpen(false)}
          >
            <RangeFilterPanel
              applyQuickFilter={applyQuickFilter}
              clearRangeFilters={clearRangeFilters}
              hasRangeFilters={hasRangeFilters}
              setSugarMax={setSugarMax}
              setSugarMin={setSugarMin}
              setTotalSugarMax={setTotalSugarMax}
              setTotalSugarMin={setTotalSugarMin}
              setVolumeMax={setVolumeMax}
              setVolumeMin={setVolumeMin}
              sugarMax={sugarMax}
              sugarMin={sugarMin}
              totalSugarMax={totalSugarMax}
              totalSugarMin={totalSugarMin}
              volumeMax={volumeMax}
              volumeMin={volumeMin}
              onDone={() => setIsFilterOpen(false)}
            />
          </Modal>
        )}
      </AnimatePresence>
      {!isSupabaseConfigured && (
        <div className="fixed bottom-4 left-4 z-40 max-w-xs rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs font-medium text-amber-100">
          {t('supabase_not_configured')}
        </div>
      )}
    </div>
  );
}
