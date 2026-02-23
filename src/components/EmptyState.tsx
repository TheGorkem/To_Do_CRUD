const EmptyState = () => (
  <div className="rounded-2xl border border-dashed border-slate-200/70 bg-white/70 p-8 text-center text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
    <p className="text-lg font-semibold text-slate-900 dark:text-white">
      Henüz görev yok
    </p>
    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
      İlk görevini ekle ve ivmeni koru.
    </p>
  </div>
);

export default EmptyState;
