# Editing the XUGA site

This is a guide for non-technical XUGA team members who want to edit the
website. You will not need to write any code or use Git directly.

Everything you do here ends up as a commit on the website's GitHub repo,
and the site rebuilds automatically on Vercel. A change is usually live
about two minutes after you click **Publish**.

## What you can edit

- **Tales** — every garment story. Add a new tale, edit an existing one,
  swap photos, change the towel's voice.
- **Pages** — every word of copy on Home, Gallery, About and Contact.
- **Site settings** — brand name, tagline, navigation labels, Instagram
  handle, email, place, footer text.

## First-time setup (do this once)

You need a **GitHub personal access token** (PAT). Think of it as a
password just for the editor, that only lets you edit this one site.

1. Make sure you have a GitHub account and that an admin has added you as
   a **collaborator** on `0-robert/xuga_website` (you should see an email
   invite, or check https://github.com/0-robert/xuga_website/invitations).
   Accept the invite before going further.
2. Go to https://github.com/settings/personal-access-tokens/new
3. Fill in:
   - **Token name**: `XUGA editor` (or whatever helps you remember).
   - **Expiration**: 1 year is reasonable.
   - **Repository access**: "Only select repositories" → pick
     `0-robert/xuga_website`.
   - **Permissions** → Repository permissions:
     - **Contents**: Read and write
     - **Metadata**: Read-only (it ticks itself)
4. Click **Generate token**. Copy the token immediately (it starts with
   `github_pat_…`). You will paste this into the editor in a moment.

If your token expires later, repeat steps 2-4 and sign in again with the
new one.

## Signing in to the editor

1. Open https://xugawear.vercel.app/admin/
2. Choose **Sign in with token** (or paste a PAT when prompted).
3. Paste the token from above. Click **Sign in**.

You should now see three sections in the sidebar: **Tales**, **Pages**,
**Site settings**.

## Editing a page

1. Click **Pages** → the page you want (Home, Gallery, About, Contact).
2. Change any text. Headings, body paragraphs, button labels are all
   separate fields. Lists (like the home page "how it works" steps) let
   you reorder, add or remove items.
3. Click **Save** (top right). That stages the change.
4. Click **Publish** to commit it to the live site.
5. Wait about two minutes for Vercel to rebuild. Reload the page on the
   live site to see your change.

## Editing a tale (towel story)

1. Click **Tales** in the sidebar.
2. Open an existing one to edit, or click **New Tale** to add a garment.
3. Fill in (or change) the fields. Required ones are marked with a red
   asterisk. The story text at the bottom is the towel's own voice;
   please read `docs/towel-voice-guide.md` before writing new prose so
   the voice stays consistent. After drafting, run the story through the
   humanizer step.
4. Photos: drag images into the photo fields. They get saved into
   `/public/images/` automatically. JPEGs and WebPs work; large photos
   are fine, Astro optimises them.
5. **Save** then **Publish**.
6. After the rebuild, the tale appears on `/tales/`, on `/gallery/`, and
   at `/t/<id>/`. A QR code for the new tale is generated as part of
   the build and lands in `public/qr/<id>.svg` and `public/qr/<id>.png`.
   To download printable QRs, ask a developer to send the latest
   `public/qr/qr-sheet.html`.

## Editing site settings

1. Click **Site settings** → **Site settings**.
2. Change the brand name, tagline, Instagram handle, email, footer text
   or the navigation labels and links.
3. **Save** → **Publish**. The whole site reflects the new value on the
   next rebuild.

## Things to be careful with

- **Featured on home**: only three tales fit nicely on the home page. If
  you mark four or more as featured, the home page just shows them all
  in the same row. Keep it tidy.
- **Accent colour**: optional. If you leave it blank, the towel's story
  page uses the brand orange. To match the towel, paste an OKLCH value
  like `oklch(0.7 0.13 50)`. A developer can help pick the right value
  from the towel photo.
- **Origin year**: write it the way a person would say it
  ("around 1998", "the mid-2010s"), not as a number.
- **Story voice**: please don't paste straight from ChatGPT. The whole
  feature depends on each towel sounding like a real, slightly different
  voice. See `docs/towel-voice-guide.md`.

## When something goes wrong

- **"Failed to authenticate"**: your token expired or was revoked.
  Generate a new one (see "First-time setup") and sign in again.
- **"You don't have permission"**: an admin needs to add you as a
  collaborator on the GitHub repo first.
- **Your change isn't live after two minutes**: check
  https://vercel.com/andrew-vassallo-s-projects/xugawear/deployments —
  if the latest deploy shows red, ask a developer for help (the build
  probably failed because of an invalid field).
- **You broke something visibly on the live site**: open the GitHub
  repo, find the commit you just made (top of the list), and ask a
  developer to revert it. Reverting in Sveltia by setting the field back
  also works.

## What a developer still has to do

- Add the QR code (printed and sewn into the garment). The digital QR is
  generated automatically; turning it into a fabric tag is a workshop
  step, not a CMS step.
- Add new pages or change the visual design.
- Add or remove fields in the editor (the schemas live in
  `src/content.config.ts` and `public/admin/config.yml`).
