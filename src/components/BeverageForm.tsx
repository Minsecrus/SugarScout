import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BeverageInsert } from '../lib/supabase';

type BeverageFormProps = {
  initialValues?: BeverageInsert;
  onAdded: (beverage: BeverageInsert) => Promise<void> | void;
  submitLabel?: string;
  title?: string;
};

const emptyFormData = {
  name: '',
  brand: '',
  sugarPer100ml: '',
  volume_ml: '',
  type: 'Soda',
};

export function BeverageForm({ initialValues, onAdded, submitLabel, title }: BeverageFormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(emptyFormData);

  useEffect(() => {
    if (!initialValues) {
      setFormData(emptyFormData);
      return;
    }

    setFormData({
      name: initialValues.name,
      brand: initialValues.brand,
      sugarPer100ml: String(initialValues.sugarPer100ml),
      volume_ml: String(initialValues.volume_ml),
      type: initialValues.type,
    });
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdded({
        name: formData.name,
        brand: formData.brand,
        sugarPer100ml: parseFloat(formData.sugarPer100ml),
        volume_ml: parseInt(formData.volume_ml, 10),
        type: formData.type,
      });
      if (!initialValues) {
        setFormData(emptyFormData);
      }
    } catch (error: any) {
      alert('Error adding beverage: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-6 sm:p-8 rounded-2xl border border-white/5 shadow-sm">
      <h2 className="text-zinc-400 text-xs uppercase tracking-[0.2em] font-bold mb-6">{title ?? t('track_new_beverage')}</h2>
      
      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">{t('beverage_name')}</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg bg-black/40 text-[#E4E4E7] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] px-4 py-2.5 border border-white/5 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-colors" placeholder="e.g., Coke Classic" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">{t('brand')}</label>
          <input required type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full rounded-lg bg-black/40 text-[#E4E4E7] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] px-4 py-2.5 border border-white/5 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-colors" placeholder="e.g., Coca-Cola" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">{t('sugar_g100ml')}</label>
            <input required type="number" step="0.1" min="0" name="sugarPer100ml" value={formData.sugarPer100ml} onChange={handleChange} className="w-full rounded-lg bg-black/40 text-[#E4E4E7] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] px-4 py-2.5 border border-white/5 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-colors" placeholder="e.g., 10.6" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">{t('volume_ml')}</label>
            <input required type="number" step="1" min="1" name="volume_ml" value={formData.volume_ml} onChange={handleChange} className="w-full rounded-lg bg-black/40 text-[#E4E4E7] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] px-4 py-2.5 border border-white/5 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-colors" placeholder="e.g., 330" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">{t('type')}</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full rounded-lg bg-black/40 text-[#E4E4E7] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] px-4 py-2.5 border border-white/5 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-colors appearance-none">
            <option value="Soda" className="bg-zinc-900">{t('categories.Soda')}</option>
            <option value="Tea" className="bg-zinc-900">{t('categories.Tea')}</option>
            <option value="Juice" className="bg-zinc-900">{t('categories.Juice')}</option>
            <option value="Energy Drink" className="bg-zinc-900">{t('categories.Energy Drink')}</option>
            <option value="Coffee" className="bg-zinc-900">{t('categories.Coffee')}</option>
            <option value="Other" className="bg-zinc-900">{t('categories.Other')}</option>
          </select>
        </div>
      </div>
      
      <div className="pt-4">
        <button disabled={loading} type="submit" className="w-full bg-white text-black hover:bg-zinc-200 font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50">
          {loading ? t('saving') : (submitLabel ?? t('add_button'))}
        </button>
      </div>
    </form>
  );
}
