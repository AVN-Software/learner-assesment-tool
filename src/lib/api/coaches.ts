export async function fetchCoaches() {
  const res = await fetch('/api/coaches', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch coaches');
  return res.json();
}
