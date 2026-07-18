# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint (`eslint .` — `next lint` was removed in Next.js 16)
- `pnpm typecheck` - Run `tsc --noEmit`

## Project Architecture

This is a Next.js 16 portfolio and blog site built with TypeScript, using the App Router architecture. The site showcases projects and blog posts through MDX content.

### Core Technologies

- **Next.js 16** with App Router (Turbopack is the default builder)
- **React 19** with latest features
- **TypeScript 6** with strict mode
- **Tailwind CSS v4** (CSS-first config) with shadcn/ui components
- **MDX** for blog posts and project content
- **Framer Motion** for animations
- **React Hook Form** with Zod validation
- **next-themes** for dark mode support

### Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable React components organized by feature
- `src/content/` - MDX content files for projects and blog posts
- `src/lib/` - Utility functions and content parsing logic
- `src/models/` - TypeScript type definitions
- `src/providers/` - React context providers
- `src/data/` - Static data files (experience, skills, links)
- `src/styles/` - Global CSS; `globals.css` is the single Tailwind entry point

### Content System

The site uses a file-based content system with MDX files:

- **Projects**: Located in `src/content/projects/`, parsed by `src/lib/content.ts`
- **Blog posts**: Located in `src/content/posts/`, with metadata parsing
- Content files use gray-matter for frontmatter parsing
- Projects support a `featured` flag for homepage display

### Key Features

- **Responsive design** with mobile-first approach
- **Dark/light theme** switching with next-themes
- **Contact form** using React Hook Form, Zod validation, and Resend for email
- **Blog functionality** with MDX rendering and custom components
- **Project showcase** with filtering and featured projects
- **SEO optimized** with proper metadata handling
- **View transitions** using next-view-transitions
- **Analytics** integrated with Vercel Analytics

### Component Architecture

- **UI Components**: shadcn/ui based components in `src/components/ui/`
- **Feature Components**: Organized by feature (contact, navigation, portfolio, etc.)
- **MDX Components**: Custom components for enhanced MDX rendering
- **Provider Pattern**: Context providers for theme, navigation state, and active sections

### Migration Notes

Migrated from Next.js 15 to 16 and Tailwind CSS 3 to 4 (July 2026).

#### Major Version Upgrades

- **Next.js**: `15.5.9` → `16.2.10` (Turbopack now the default builder)
- **Tailwind CSS**: `3.4.17` → `4.3.3` (CSS-first configuration)
- **TypeScript**: `5.9.2` → `6.0.3`
- **Zod**: `3` → `4`, **@hookform/resolvers**: `3` → `5`
- **react-email**: consolidated `@react-email/components` + `@react-email/tailwind` → single `react-email` package
- **@vercel/analytics**: `1` → `2`, **sonner**: `1` → `2`, **tailwind-merge**: `2` → `3`
- **Prisma**: removed entirely (was unused scaffolding; see below)

#### Deliberately NOT on latest

- **ESLint pinned to `9.39.5`.** ESLint 10 removes the `context.getFilename()` API that
  `eslint-plugin-react` (a transitive dep of `eslint-config-next`) still calls, which hard-crashes
  linting. Revisit once vercel/next.js#91710 lands.
- **TypeScript pinned to `6.0.3`.** TypeScript 7 (the Go port) ships no programmatic JS API until
  7.1, which breaks both `next build` and typescript-eslint. Revisit after TS 7.1.

#### Breaking Changes & Code Updates

- **`next lint` removed**: the `lint` script now calls `eslint .` directly, and `.eslintrc.json`
  was replaced by flat config in `eslint.config.mjs`.
- **Image `qualities`**: Next 16 defaults to `[75]` only. Project/post images render at
  `quality={95}`, so `images.qualities` is set explicitly in `next.config.mjs`.
- **`scroll-behavior`**: Next 16 only neutralizes smooth scrolling during navigation when
  `data-scroll-behavior="smooth"` is on `<html>`; added in `app/layout.tsx`.
- **Turbopack asset strictness**: `favicon.ico` contained a grayscale+alpha (`LA`) PNG frame that
  Turbopack refuses to decode. All 9 frames were re-encoded as RGBA.
- **Tailwind v4**: `tailwind.config.ts` deleted; theme now lives in `@theme inline` in
  `src/styles/globals.css`. The `color-level-*` helpers became `@utility` rules so `@apply` still
  works. `mdx.css` and `loading.css` are now `@import`ed from `globals.css` rather than imported
  from components — v4 `@apply` needs a shared context. `tailwindcss-animate` → `tw-animate-css`,
  and PostCSS uses `@tailwindcss/postcss` (autoprefixer no longer needed).
- **Tailwind v4 utility renames applied**: `flex-grow`→`grow`, `flex-shrink-0`→`shrink-0`,
  `shadow-sm`→`shadow-xs`, `backdrop-blur`→`backdrop-blur-sm`, `outline-none`→`outline-hidden`,
  `bg-opacity-*`/`border-opacity-*` → slash syntax, `bg-[--var]` → `bg-(--var)`.
- **Zod 4**: `z.string().email()` → `z.email()`; `issue.path` is now `PropertyKey[]` so path
  segments need `String(...)` before concatenation.
- **React Icons**: `SiAdobephotoshop`/`SiAdobeillustrator` were removed upstream; replaced with
  `TbBrandAdobePhotoshop`/`TbBrandAdobeIllustrator`.
- **@vercel/style-guide dropped**: it peers on ESLint <9. Its Prettier preset is now inlined in
  `prettier.config.js`.
- **Prisma removed**: `src/lib/db.ts` was imported by nothing and the guestbook feature was never
  built. Prisma 7 also rejects `url` inside the datasource block. The schema is preserved in git
  history (see `prisma/schema.prisma` at commit `26c2405`) if the guestbook is revived.

### Styling

- **Tailwind CSS v4** configured entirely in CSS via `@theme inline` — there is no `tailwind.config.ts`
- **CSS Variables** for theme colors defined in `src/styles/globals.css`
- **Typography plugin** for MDX content styling, loaded with `@plugin`
- **Animation utilities** with tw-animate-css
- **Dark mode** via `@custom-variant dark` matching the `.dark` class set by next-themes

### Path Aliases

Uses `@/*` alias pointing to `src/*` for clean imports throughout the codebase.
