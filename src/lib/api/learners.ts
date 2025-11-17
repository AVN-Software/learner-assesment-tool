export async function fetchLearners(fellowId: string) {
  const res = await fetch(`/api/learners/${fellowId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch learners');
  return res.json();
}
