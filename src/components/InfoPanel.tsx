import { ExternalLink, Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GITHUB_URL = 'https://github.com/Minsecrus/SugarScout';

export function InfoPanel() {
  const { t } = useTranslation();

  return (
    <section className="space-y-6 pr-8">
      <div>
        <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] font-bold mb-3">{t('info_label')}</p>
        <h2 className="text-2xl font-bold text-white">{t('info_title')}</h2>
      </div>

      <p className="text-sm leading-6 text-zinc-300">{t('info_description')}</p>

      <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">{t('info_data_title')}</p>
        <p className="text-sm leading-6 text-zinc-300">{t('info_data_desc')}</p>
      </div>

      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white text-black px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-zinc-200"
      >
        <Github size={18} />
        <span>{t('github_link')}</span>
        <ExternalLink size={15} />
      </a>
    </section>
  );
}
