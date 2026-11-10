export function formatDate(value: string) {
  if (!value) return '—';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

export function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function daysSince(value: string) {
  const date = new Date(`${value}T00:00:00Z`).getTime();
  return Math.floor((Date.now() - date) / 86400000);
}
