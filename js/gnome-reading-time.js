// Gnome-specific reading duration; the existing cat speech timing stays intact.
export const GNOME_READING_POLICY = Object.freeze({wordsPerMinute:180, marginMs:2000, minimumMs:6000});
export function gnomeReadingDuration(text, policy = GNOME_READING_POLICY) {
  const words = String(text || '').match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length || 0;
  const positive = (value, fallback) => Number.isFinite(value) && value > 0 ? value : fallback;
  const rate = positive(policy.wordsPerMinute, GNOME_READING_POLICY.wordsPerMinute);
  const margin = Number.isFinite(policy.marginMs) && policy.marginMs >= 0 ? policy.marginMs : GNOME_READING_POLICY.marginMs;
  const minimum = positive(policy.minimumMs, GNOME_READING_POLICY.minimumMs);
  return Math.max(minimum, Math.ceil(words * 60000 / rate + margin));
}
