/**
 * Rank multiplier for project age. Raw evidence points stay unchanged.
 *
 * Age at or under {@link RECENCY_FULL_YEARS} keeps weight 1. After that:
 * `exp(-ln(2) * ((age - full) / halfLife) ^ curve)`.
 *
 * With the defaults below, as of a given year:
 * - 0–5 years: 1.00
 * - 7 years: ~0.96
 * - 10 years: ~0.76
 * - 13 years: 0.50
 * - 15 years: ~0.34
 * - 20 years: ~0.09
 * - 25 years: ~0.01
 *
 * Lower {@link RECENCY_HALF_LIFE_YEARS} or raise {@link RECENCY_CURVE} to
 * punish older work harder. A missing year stays at 1.
 */

/** No penalty through this many years old. */
export const RECENCY_FULL_YEARS = 5;

/** Years after the plateau until the weight is one half. */
export const RECENCY_HALF_LIFE_YEARS = 8;

/**
 * 1 is a steady exponential. Higher values stay gentler just past the
 * plateau, then fall faster.
 */
export const RECENCY_CURVE = 2;

/** Representative project year, or unknown. */
export function recencyWeight(
  year: number | null | undefined,
  asOfYear = new Date().getUTCFullYear(),
): number {
  if (year == null || !Number.isFinite(year)) return 1;
  const age = asOfYear - year;
  if (age <= RECENCY_FULL_YEARS) return 1;
  const excess = (age - RECENCY_FULL_YEARS) / RECENCY_HALF_LIFE_YEARS;
  return Math.exp(-Math.LN2 * excess ** RECENCY_CURVE);
}
