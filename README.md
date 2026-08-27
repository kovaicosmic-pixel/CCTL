# Cosmic Polish

GOAL: Visual-only UI upgrade of the CCTL (Cosmic Compliance Test Lab) website. This is a UI 

polish pass, not a redesign. Do NOT change: page structure, section order, UX flows, navigation 

logic, animation/motion behavior, scroll interactions, or the existing color HUES (stay light 

theme, same oklch color family — primary/neutral blues-greys). Every change below is about 

visual craft: spacing, typography, depth, imagery, and finishing detail — the things that make 

a site feel "premium" instead of "template."

WHY: The current UI reads as a generic template — flat cards, default shadows, weak type 

hierarchy, low-quality/no imagery, and inconsistent spacing. I need this to give an immediate 

"wow" on first glance, the way premium SaaS/lab/industrial sites (Linear, Vercel, high-end 

scientific/industrial brands) look — precise, expensive, intentional.

APPLY THESE CHANGES SITE-WIDE:

1. TYPOGRAPHY HIERARCHY

- Increase contrast between heading and body weight/size — headings should feel confident and 

large, body text should be quieter and smaller than it currently is.

- Fix inconsistent line-height and letter-spacing; tighten large headline tracking slightly, 

loosen body text tracking slightly for readability.

- Ensure a clear 4–5 level type scale is used consistently across Hero, section titles, 

sub-titles, and body — no ad hoc font sizes.

2. SPACING & LAYOUT RHYTHM

- Standardize vertical rhythm between sections (consistent padding-top/bottom on every section, 

not per-section guesses).

- Increase whitespace/breathing room around headlines and CTAs — premium sites are never 

cramped.

- Align all grids/cards to a consistent gutter and max-width container instead of variable 

widths.

3. CARDS & SURFACES (pillars, why-choose-us, service cards, testimonials, etc.)

- Replace flat/default card style with subtle elevation: soft layered shadows, refined 1px 

borders using the existing border token, slightly increased corner radius for a more premium 

(not playful) feel.

- Add tasteful hover elevation change on cards (shadow/scale only — no new interaction pattern) 

using the SAME hover mechanism already in the codebase.

- Ensure icon/number treatments inside cards look designed, not default (consistent size, 

consistent background chip style, consistent alignment).

4. IMAGERY & VISUAL DEPTH

- Current hero/section imagery feels placeholder-level. Upgrade to higher-quality, 

industrial/lab-appropriate photography or renders (clean chamber interiors, precision 

equipment, engineers at work) that match a "premium EMC testing lab" brand — cinematic 

lighting, not stock-photo flat lighting.

- Add subtle depth cues already used elsewhere in the codebase (existing grain/spotlight/mask 

components) to hero and key sections so imagery doesn't sit flat against the background.

- Keep all currently working motion/graphics components (chamber canvas, calibration loader, 

etc.) untouched — only refine their surrounding visual container (padding, border, shadow).

5. COLOR USAGE (not new colors — better use of existing tokens)

- Use the existing primary/accent color more deliberately: as a highlight for key numbers, 

underlines, active states, and CTA buttons — not scattered inconsistently.

- Ensure sufficient contrast for muted-foreground text against background across all sections 

(some current text reads too light/generic-grey).

- Buttons: give the primary CTA a more refined premium button style (weight, padding, subtle 

shadow, refined hover state) using ONLY the current color tokens.

6. NAVBAR & FOOTER

- Navbar: refine spacing, logo/wordmark treatment, and active-link indicator so it feels 

tighter and more intentional, not a default flex row.

- Footer: currently under-designed — give it clear column hierarchy, better spacing, and a 

more finished sign-off area (matches premium SaaS footer patterns), keeping current links/data.

7. CONSISTENCY PASS

- Audit every page (Home, About, Services, Blog, Contact) against the same design tokens above 

so nothing feels like a different site.

- Remove any visual inconsistency between sections (mismatched paddings, inconsistent heading 

sizes, inconsistent card styles).

DO NOT:

- Do not change the animation/motion timing, easing, or triggers already implemented (Reveal, 

StaggerGroup, ParallaxGallery, Magnetic, Spotlight, etc.) — only their visual container styling.

- Do not change the light theme or introduce a new color palette/hue.

- Do not restructure page/section order or remove any existing content/sections.

- Do not change existing UX flows (forms, navigation, CTAs functionality).

OUTPUT: Apply this polish pass across the whole site consistently so a first-glance view of the 

homepage alone gives a strong "premium/expensive" impression — sharp typography, real depth, 

intentional spacing, and high-quality imagery, while every existing interaction and animation 

behaves exactly as it does today.just do what i said in the prompt dont create images, focus on improving the UI presentation for this website by following same light theme and white and blue colors

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aa293f4f-8a1f-49f2-9526-282e6847647f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
