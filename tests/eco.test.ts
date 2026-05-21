import { describe, it, expect } from 'vitest';
import { computeEco } from '../src/lib/eco';

describe('computeEco', () => {
  it('returns null when no inputs are given', () => {
    expect(computeEco({})).toBeNull();
  });

  it('estimates water and CO2 from towel weight', () => {
    const r = computeEco({ towelWeightGrams: 600 })!;
    expect(r.textileSavedGrams).toBe(600);
    expect(r.waterSavedLitres).toBe(6000); // 10 L per gram
    expect(r.co2SavedKg).toBe(9); // 0.015 kg per gram
    expect(r.estimated).toBe(true);
  });

  it('uses an explicit water override when provided', () => {
    const r = computeEco({ towelWeightGrams: 600, waterSavedLitres: 8000 })!;
    expect(r.waterSavedLitres).toBe(8000);
  });

  it('works from explicit values alone, without a towel weight', () => {
    const r = computeEco({ textileSavedGrams: 500, co2SavedKg: 7 })!;
    expect(r.textileSavedGrams).toBe(500);
    expect(r.co2SavedKg).toBe(7);
    expect(r.waterSavedLitres).toBe(5000); // still derived from textile
  });

  it('rounds CO2 to one decimal place', () => {
    const r = computeEco({ towelWeightGrams: 333 })!;
    expect(r.co2SavedKg).toBe(5); // 333 * 0.015 = 4.995 -> 5.0
  });
});
