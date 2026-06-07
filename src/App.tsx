import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BeverageForm } from './components/BeverageForm';
import { BeverageList } from './components/BeverageList';
import { Beverage } from './types';
import { BeverageInsert, isSupabaseConfigured, supabase } from './lib/supabase';
import { Plus, X, Search, Droplets, Globe, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = ['All', 'Soda', 'Juice', 'Coffee', 'Tea', 'Energy Drink', 'Other'];

const INITIAL_DATA: Beverage[] = [
  { id: '1', name: 'Original Cola', brand: 'Coca-Cola', sugarPer100ml: 10.6, volume_ml: 330, type: 'Soda' },
  { id: '2', name: 'Fresh Orange Juice', brand: 'Tropicana', sugarPer100ml: 9.0, volume_ml: 250, type: 'Juice' },
  { id: '3', name: 'Monster Energy', brand: 'Monster', sugarPer100ml: 11.0, volume_ml: 500, type: 'Energy Drink' }
];

export default function App() {
  const { t, i18n } = useTranslation();
  const [beverages, setBeverages] = useState<Beverage[]>(INITIAL_DATA);
  const [loadingBeverages, setLoadingBeverages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name_asc');
  const [isFormOpen, setIsFormOpen] = useState(false);

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
        id: Math.random().toString(36).substring(7)
      };
      setBeverages((prev) => [newBeverage, ...prev]);
      setIsFormOpen(false);
      return;
    }

    const { data, error } = await supabase
      .from('beverages')
      .insert(beverage)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw new Error(t('add_failed'));
    }

    setBeverages((prev) => [data, ...prev]);
    setIsFormOpen(false);
  };

  const handleDeleteBeverage = async (id: string) => {
    if (!window.confirm(t('confirm_delete'))) {
      return;
    }

    if (supabase) {
      const { error } = await supabase
        .from('beverages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(error);
        alert(t('delete_failed'));
        return;
      }
    }

    setBeverages((prev) => prev.filter((beverage) => beverage.id !== id));
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  };

  const filteredBeverages = useMemo(() => {
    let result = beverages.filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            b.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || b.type === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'sugar_asc': return a.sugarPer100ml - b.sugarPer100ml;
        case 'sugar_desc': return b.sugarPer100ml - a.sugarPer100ml;
        case 'volume_asc': return a.volume_ml - b.volume_ml;
        case 'volume_desc': return b.volume_ml - a.volume_ml;
        default: return 0;
      }
    });

    return result;
  }, [beverages, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] font-sans flex flex-col selection:bg-cyan-500/30">
      <header className="bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <Droplets size={16} className="text-black" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">{t('title')}<span className="text-cyan-400 font-light">{t('subtitle')}</span></h1>
          </div>
          <div>
            <button 
              onClick={toggleLanguage}
              className="bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all hover:border-white/20"
            >
              <Globe size={16} />
              <span>{i18n.language === 'zh' ? 'EN' : '中'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-12 flex-1 flex flex-col">
        
        {/* Hero Section */}
        <div className="w-full mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
          >
            {t('hero_title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-300 mb-10 max-w-2xl"
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
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full bg-zinc-900/80 text-[#E4E4E7] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] pl-12 pr-6 py-3.5 border border-white/10 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all" 
                  placeholder={t('search_placeholder')} 
                />
              </div>
              
              <div className="flex bg-zinc-900/80 rounded-full border border-white/10 text-sm overflow-hidden h-12">
                <div className="flex items-center px-4 border-r border-white/10 text-zinc-300 font-medium">
                  <ArrowUpDown size={16} className="mr-2" />
                  {t('sort_by')}
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-white px-4 py-3 outline-none cursor-pointer appearance-none flex-1 min-w-[150px]"
                >
                  <option value="name_asc" className="bg-zinc-900">{t('name_asc')}</option>
                  <option value="name_desc" className="bg-zinc-900">{t('name_desc')}</option>
                  <option value="sugar_asc" className="bg-zinc-900">{t('sugar_asc')}</option>
                  <option value="sugar_desc" className="bg-zinc-900">{t('sugar_desc')}</option>
                  <option value="volume_asc" className="bg-zinc-900">{t('volume_asc')}</option>
                  <option value="volume_desc" className="bg-zinc-900">{t('volume_desc')}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category 
                      ? 'bg-cyan-500 text-black border border-cyan-500' 
                      : 'bg-zinc-900/50 text-zinc-300 border border-white/5 hover:border-white/20'
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
            <BeverageList beverages={filteredBeverages} onDelete={handleDeleteBeverage} />
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
          className="fixed bottom-8 right-8 bg-cyan-500 text-black w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.4)] z-40"
          title={t('add_beverage')}
        >
          <Plus size={28} />
        </motion.button>
      )}

      {/* Add Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsFormOpen(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-white/10 p-6 sm:p-8 rounded-3xl w-full max-w-xl relative shadow-2xl"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors p-1 bg-white/5 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
              <BeverageForm onAdded={handleAddBeverage} />
            </motion.div>
          </div>
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
