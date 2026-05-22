# Towel Voice Guide

Every story on this site is told by the towel itself. This guide keeps that
voice consistent no matter who writes the next one.

## The register: warm and sentimental

The towel is fond, gentle, and a little nostalgic. It tells its story the way
someone tells you about an old friend. It is emotional, but it never begs for
the reaction. It trusts the small, true detail to do the work.

It is **not** a stand-up comedian. No relentless one-liners, no "plot twist",
no jokes stacked three deep. A quiet, well-placed bit of dryness is welcome.
Manufactured zing is not.

## The reference

This is the bar. Finn, the dolphin belt bag:

> My name's Finn. I was a beach towel for nine summers, the proper kind, where
> the sand gets everywhere and nobody minds. I remember a little girl who
> refused to be dried by any towel but me. I remember being forgotten at the
> beach one evening, and a stranger folding me up and taking me home anyway.
>
> By the end I was thin and pale and the dolphins were barely there. I thought
> that was it.
>
> Then someone in Malta sat down with me, kept the parts that still had life in
> them, and sewed me into a belt bag. Same towel. Still going to the beach.
> Just closer to you now.

Notice what it does: concrete memories instead of adjectives, sentences of
different lengths, one short paragraph that lands because the ones around it
are longer, and an ending that is quiet rather than triumphant.

## A loose shape for a story

Three or four short paragraphs is plenty.

1. **Who I was.** The towel's first life: the beach, the years, a specific
   memory or two. Use `originPlace` and `originYearApprox` for grounding.
2. **The turn.** Getting worn out. The moment it could have been thrown away.
   Keep this honest and brief.
3. **What I became.** Rescued, cut, resewn. Name the maker if you can. End
   close to the reader: this piece is with them now.

Each towel still has its own personality inside the warm register. Use the
`towelPersonality` field to nudge it: a hotel towel can be a touch grand, a
family beach towel can be homier. Same warmth, different colour.

## Banned tells

These mark writing as AI-generated or as trying too hard. Do not use them.

- The words: *journey, embark, nestled, testament to, tapestry, more than just,
  in a world where, little did I know, vibrant, bustling.*
- "Plot twist", "and then everything changed", or any announced surprise.
- Clipped fragments stacked for punch: "New life. Fresh start. Same towel."
  One short sentence is a beat. Three in a row is a tic.
- The rule of three: groups of three adjectives or three clauses.
- Em dashes. Use commas, full stops, or brackets.
- Exclamation marks, and words SHOUTED in capitals.
- A grand closing line that tells the reader how to feel.

## The humanizer pass (required)

Before any story goes live, run it through the `humanizer` skill in
`.claude/skills`:

1. Write the draft.
2. Ask: "What makes the below so obviously AI generated?" Answer it honestly.
3. Revise to fix what you found.
4. Read it aloud. If a sentence does not sound like a person talking, change it.

A story is finished when it sounds like the towel, not like a brand, and not
like a model.
