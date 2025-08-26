# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Architecture

This is a Next.js 15 portfolio and blog site built with TypeScript, using the App Router architecture. The site showcases projects and blog posts through MDX content.

### Core Technologies
- **Next.js 15** with App Router
- **React 19** with latest features
- **TypeScript** with strict mode
- **Tailwind CSS** with shadcn/ui components
- **Prisma v6** with PostgreSQL for database
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
- `prisma/` - Database schema and migrations

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

### Database

Uses Prisma v6 with PostgreSQL for:
- User authentication (prepared for future auth features)
- Guestbook functionality (GuestbookNote model)
- User roles and account management

### Migration Notes

The project was recently migrated from Next.js 14 to 15 with the following key changes:
- **Dynamic Route Params**: Now async in Next.js 15 - use `const { slug } = await params;`
- **MDX Components**: Direct imports instead of `next/dynamic` with `ssr: false` in Server Components
- **Dependencies**: All packages updated to latest compatible versions
- **next-themes**: Import types directly from main package instead of `/dist/types`
- **React Icons**: Some icons may need fallbacks if removed from newer versions

### Styling

- **Tailwind CSS** with custom theme configuration
- **CSS Variables** for theme colors defined in globals.css
- **Typography plugin** for MDX content styling
- **Animation utilities** with tailwindcss-animate

### Path Aliases

Uses `@/*` alias pointing to `src/*` for clean imports throughout the codebase.