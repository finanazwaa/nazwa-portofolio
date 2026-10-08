# Personal portfolio

A quiet, editorial portfolio built with Next.js App Router, TypeScript, and Tailwind CSS. The site uses Inter and Fraunces through `next/font` and is structured so each route renders server-side with ordinary links.

## Run locally

- `npm run dev` starts the development server at `http://localhost:3000`.
- `npm run build` creates and validates the production build.
- `npm start` serves the production build.

## Routes

- `/` — one-page portfolio: hero (3D desk), then `#about`, `#areas`, `#work` and `#contact` sections
- `/work/sociolla`, `/work/dsmile`, `/work/byu`, `/work/cosmetics`, `/work/erp`, `/work/retail`, `/work/enose-tb`, `/work/enose-qt-widget` — project stories
- `/about`, `/areas`, `/work`, `/contact` — temporary redirects to the matching home-page section (`next.config.ts`)

## Content before launch

All owner details, social destinations, project roles/tools/years/teams, project imagery and project stories are marked `TODO(content)` in `lib/content.ts`. Replace these only with verified information. The guessed category and area mappings also need verification. The contact section is a `mailto:` call to action, so it needs no form service or backend. Project hero visuals are intentional paper-field placeholders, not stock imagery.

## Design system

The shared palette, typography hooks, motion timings, spacing and reduced-motion defaults are in `app/globals.css`. Central copy and project ordering live in `lib/content.ts`.
