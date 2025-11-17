export async function fetchFellows(coachId: string) {
  const res = await fetch(`/api/fellows/${coachId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch fellows');
  return res.json();
}
