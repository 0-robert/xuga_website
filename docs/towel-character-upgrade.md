# Upgrading the towel character

The talking towel is media-agnostic. Each garment declares whatever character
assets it has, and `TowelCharacter.astro` renders the richest one. You can
start every towel on tier 1 and upgrade any of them later with no code change.

| Tier | Asset | Effort | Frontmatter field |
|---|---|---|---|
| 1 | Towel photo + code-drawn SVG eyes | None, automatic | `towelPhoto` |
| 2 | A short looping video | Generate one clip | `towelVideo` |
| 3 | A Rive interactive character | Design a `.riv` file | `towelRive` |

The tier is chosen by `src/lib/character-tier.ts`: rive wins over video, video
wins over photo. So adding a richer asset takes over automatically.

## Tier 1 — photo and SVG eyes (default)

Set `towelPhoto` and you are done. The eyes blink, drift while idle, follow the
pointer, and breathe. Place them on the photo with the `eyes` field:

```yaml
towelPhoto: ../../assets/garments/dolphin-belt--towel.png
eyes:
  x: 50      # horizontal centre of the eye pair, percent of the photo
  y: 38      # vertical centre, percent
  scale: 1   # size multiplier
```

Frame the towel photo so the towel fills it and the eyes can sit on a calm,
even patch of fabric.

## Tier 2 — a looping video (Higgsfield)

Higgsfield turns a still image into a short animated video and can loop it.
This is a good way to make a towel feel alive without any 3D tooling.

1. Feed the towel photo to Higgsfield. Prompt for a gentle, subtle loop: soft
   fabric movement, a slow blink, eyes drifting. Keep it calm, in keeping with
   the warm and sentimental voice. Avoid anything frantic.
2. Export a short loop (2 to 5 seconds). Save it as `.webm`, with an `.mp4`
   fallback if you have one.
3. Put the file in `public/media/` and a still frame for the poster in
   `src/assets/garments/`.
4. Add to the garment's frontmatter:

```yaml
towelVideo:
  src: /media/finn-loop.webm
  poster: ../../assets/garments/dolphin-belt--towel.png
```

`TowelCharacter` will now play the loop, muted and inline, instead of the SVG
eyes. The video must be muted so it autoplays on phones.

## Tier 3 — a Rive interactive character

Rive is the best option for a fully interactive character, and the natural
vehicle for an illustrated towel mascot (the "Option 2" from the design
discussion). A `.riv` file has to be authored in the Rive editor; it cannot be
produced from code.

**Designing the asset**

- In the Rive editor, build the towel as an illustrated character, or import
  the towel photo and rig eyes over it.
- Add a state machine with inputs the page can drive, for example `blink` and
  a `lookX` / `lookY` pair.
- Export a `.riv` file and place it in `public/media/`.

**Enabling the runtime** (one-time, the project ships without it)

```
npm install @rive-app/canvas
```

Then add an init script. `TowelCharacter.astro` already renders the mount
point for the rive tier: `<canvas>` inside a `figure[data-towel-rive]`. Wire it
up with a new `<script>` in that component:

```js
import { Rive } from '@rive-app/canvas';

document.querySelectorAll('[data-towel-rive]').forEach((el) => {
  const canvas = el.querySelector('canvas');
  new Rive({
    src: el.dataset.towelRive,
    canvas,
    autoplay: true,
    stateMachines: el.dataset.riveStateMachine,
  });
});
```

**Frontmatter**

```yaml
towelRive:
  src: /media/finn.riv
  stateMachine: Towel
```

## Illustrated mascot, without Rive

If you want an illustrated towel character but not the interactivity, the
simplest path is to draw the mascot, animate a short loop, and ship it as a
tier 2 video. You get the illustrated look with none of the runtime work.
