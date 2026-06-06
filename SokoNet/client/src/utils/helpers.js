export function formatDate(value) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function badgeClass(value) {
  if (value === 'active' || value === 'completed') return 'bg-emerald-500/10 text-emerald-300';
  if (value === 'held' || value === 'pending') return 'bg-amber-500/10 text-amber-300';
  return 'bg-slate-700/10 text-slate-200';
}
