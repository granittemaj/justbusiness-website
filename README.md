# Just Business: website concept

A concept website for [Just Business](https://www.justbusiness.is), built around its founding partnership with [Not For Sale](https://wearenotforsale.org). The home page centres on a live, rotating globe: orange points are Not For Sale field projects, cyan points are Just Business ventures.

**Live preview:** https://granittemaj.github.io/justbusiness-website/

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Ventures | `ventures.html` |
| Venture detail (one template for all ventures) | `venture.html?v=hydra-energy`, `abtc`, `rebbl`, `dignita`, `krunam` |
| Not For Sale partnership | `not-for-sale.html` |
| Approach | `approach.html` |
| About | `about.html` |
| News | `news.html` |
| Contact | `contact.html` |

## How it's built

Plain HTML, CSS and JavaScript. No framework and no install step.

- `assets/data.js`: all content (ventures, Not For Sale projects, news). Edit it here and every page updates.
- `assets/site.css`: the design system.
- `assets/site.js`: menus, reveals, filters, the four-lines interaction and form validation.
- `assets/globe.js`: the globe (d3 + world-atlas, loaded from a CDN).
- `src/`: page sources. `python3 build.py` stamps the shared header and footer onto each page and writes them to the root. **Edit pages in `src/`, then run the build.**

To preview locally, run `python3 -m http.server` in this folder and open http://localhost:8000.

## Before launch

- The contact form validates but isn't connected to an inbox yet.
- Venture photography is placeholder (Unsplash) and should be replaced with real portfolio imagery.
- Confirm venture locations on the globe and the founding dates (Just Business 2006, Not For Sale 2007).
- The logo and team photos load from the current Squarespace site; move them into this repo.
