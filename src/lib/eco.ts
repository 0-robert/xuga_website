/**
 * Eco-impact estimation for an upcycled garment.
 *
 * The headline figures are deliberately framed as estimates. They are derived
 * from average new-cotton textile production, the impact that is *avoided* by
 * giving an existing towel a second life instead of buying new fabric:
 *
 *   - Water: cotton textile has a very large water footprint. The Water
 *     Footprint Network puts it around 10,000 litres per kilogram of cotton.
 *     We use 10 litres per gram as a conservative round figure.
 *   - CO2: producing cotton textile emits roughly 15 kg CO2e per kilogram.
 *     We use 0.015 kg per gram.
 *
 * These constants are intentionally the only place the numbers live, so the
 * basis of every claim on the site is documented in one spot.
 */
const WATER_LITRES_PER_GRAM = 10;
const CO2_KG_PER_GRAM = 0.015;

export interface EcoInput {
  /** Weight of the source towel in grams; drives the estimates. */
  towelWeightGrams?: number;
  /** Explicit override for litres of water saved. */
  waterSavedLitres?: number;
  /** Explicit override for kg of CO2e saved. */
  co2SavedKg?: number;
  /** Explicit override for grams of textile kept from landfill. */
  textileSavedGrams?: number;
}

export interface EcoImpact {
  textileSavedGrams: number;
  waterSavedLitres: number;
  co2SavedKg: number;
  /** True when at least one figure was derived rather than supplied. */
  estimated: boolean;
}

/**
 * Returns the eco impact for a garment, or null when there is nothing to show
 * (no towel weight and no explicit overrides). A null result means the story
 * page omits the eco chapter entirely.
 */
export function computeEco(input: EcoInput): EcoImpact | null {
  const hasExplicit =
    input.waterSavedLitres != null ||
    input.co2SavedKg != null ||
    input.textileSavedGrams != null;

  if (input.towelWeightGrams == null && !hasExplicit) {
    return null;
  }

  const textileSavedGrams =
    input.textileSavedGrams ?? input.towelWeightGrams ?? 0;

  const waterSavedLitres =
    input.waterSavedLitres ??
    Math.round(textileSavedGrams * WATER_LITRES_PER_GRAM);

  const co2SavedKg =
    input.co2SavedKg ??
    Math.round(textileSavedGrams * CO2_KG_PER_GRAM * 10) / 10;

  // Estimated unless every figure was supplied explicitly.
  const estimated = !(
    input.waterSavedLitres != null &&
    input.co2SavedKg != null &&
    input.textileSavedGrams != null
  );

  return { textileSavedGrams, waterSavedLitres, co2SavedKg, estimated };
}
