/**
 * The towel character is media-agnostic. A garment may supply one or more of
 * three asset kinds; the richest available one wins:
 *
 *   tier 1  eyes   towel photo + code-drawn SVG eyes  (always buildable)
 *   tier 2  video  a looping clip, e.g. from Higgsfield
 *   tier 3  rive   a Rive interactive asset
 *
 * See docs/towel-character-upgrade.md for how to add the richer tiers.
 */
export type CharacterTier = 'rive' | 'video' | 'eyes';

export interface CharacterAssets {
  /** Any truthy value marks the towel photo as present. */
  towelPhoto?: unknown;
  towelVideo?: { src?: string } | undefined;
  towelRive?: { src?: string } | undefined;
}

/**
 * Returns the tier to render for a garment, or null when the towel has no
 * usable character asset at all (the page then shows no character).
 */
export function selectTier(assets: CharacterAssets): CharacterTier | null {
  if (assets.towelRive?.src) return 'rive';
  if (assets.towelVideo?.src) return 'video';
  if (assets.towelPhoto) return 'eyes';
  return null;
}
