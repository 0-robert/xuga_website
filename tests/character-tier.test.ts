import { describe, it, expect } from 'vitest';
import { selectTier } from '../src/lib/character-tier';

describe('selectTier', () => {
  it('returns null when no assets are present', () => {
    expect(selectTier({})).toBeNull();
  });

  it('selects eyes when only a towel photo exists', () => {
    expect(selectTier({ towelPhoto: { src: 'finn.jpg' } })).toBe('eyes');
  });

  it('prefers video over a photo', () => {
    expect(
      selectTier({
        towelPhoto: { src: 'finn.jpg' },
        towelVideo: { src: 'finn.webm' },
      }),
    ).toBe('video');
  });

  it('prefers rive over everything else', () => {
    expect(
      selectTier({
        towelPhoto: { src: 'finn.jpg' },
        towelVideo: { src: 'finn.webm' },
        towelRive: { src: 'finn.riv' },
      }),
    ).toBe('rive');
  });

  it('ignores a video with no src', () => {
    expect(
      selectTier({ towelPhoto: { src: 'finn.jpg' }, towelVideo: { src: '' } }),
    ).toBe('eyes');
  });
});
