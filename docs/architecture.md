# Architecture

Last reviewed: 2026-10-17.

## Code map

| Area                                      | Where                                                                                                                                                                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home page and experience timeline         | `src/app/(home)/page.tsx`, `src/components/link-rows.tsx`, `src/components/experience-list.tsx`, `src/components/expandable.tsx`, `src/data/experience.ts`, `src/lib/experience.ts`, `src/assets/logos` |
| Portfolio list, project pages, and layout | `src/app/portfolio`, `src/components/portfolio`, `src/data/platforms.ts`, `src/data/portfolio-layout.json`, `src/lib/portfolio-layout.ts`                                                               |
| Blog, topics, and post-only UI            | `src/app/blog`, `src/components/blog`                                                                                                                                                                   |
| MDX source and rendering                  | `src/content/{projects,posts}`, `src/components/mdx`, `src/components/image-viewer`, `src/styles/mdx.css`                                                                                               |
| Content reading and validation            | `src/lib/content.ts`, `src/schemas/content-schema.ts`, `src/models`, `src/lib/{date,topics,reading-time}.ts`                                                                                            |
| Tech stack icons and labels               | `src/data/tech-stack.ts`, `src/components/icons/tech-stack-icon.tsx`                                                                                                                                    |
| Site constants, metadata, feeds, and SEO  | `src/data/site.ts`, `src/app/layout.tsx`, `src/app/{sitemap,robots,manifest}.ts`, `src/app/feed.xml/route.ts`, `src/components/json-ld.tsx`                                                             |
| Post view counter                         | `src/lib/views.ts`, `src/actions/post-actions.ts`, `src/components/blog/post-views.tsx`                                                                                                                 |
| Contact form                              | `src/app/contact`, `src/components/contact`, `src/actions/contact-actions.ts`, `src/schemas/contact-schema.ts`, `src/lib/rate-limit.ts`, `src/email`                                                    |
| Admin portal                              | `src/app/admin`, `src/components/admin`, `src/actions/admin-actions.ts`, `src/lib/admin`, `src/schemas/admin-content-schema.ts`, `src/lib/collections.ts`, `src/data/design-history.ts`                 |
| Sign-in                                   | `src/auth.ts`, `src/app/api/auth/callback/github/route.ts`, `src/lib/admin/session.ts`                                                                                                                  |
| Database                                  | `prisma/schema.prisma`, `prisma.config.ts`, `src/lib/db.ts`; the generated client is in `src/generated/prisma`, gitignored and excluded from ESLint and Prettier                                        |
| Footer, back link, and back to top        | `src/components/site-footer.tsx`, `src/components/navigation/back-button.tsx`, `src/components/back-to-top.tsx`                                                                                         |
| Theme, fonts, and global styles           | `src/styles/globals.css`, `src/assets/fonts.ts`, `src/components/theme-toggle.tsx`                                                                                                                      |
| Logo, icons, and OpenGraph images         | `src/components/logo.tsx`, `src/app/{icon.svg,favicon.ico,apple-icon.png}`, `src/app/opengraph-image.tsx`, `src/app/blog/[slug]/opengraph-image.tsx`, `public/icon-*.png`                               |
| Shared UI primitives                      | `src/components/ui` (shadcn/ui)                                                                                                                                                                         |
| Headers, build, CI, and dependencies      | `next.config.mjs`, `package.json`, `pnpm-workspace.yaml`, `.github/`                                                                                                                                    |

Unit tests sit next to the code they cover as `*.test.ts`; see [Tests](#tests) for the rest.

## Content

Projects and posts are MDX files with YAML frontmatter in `src/content/`, read by `src/lib/content.ts`.

- **Frontmatter is parsed, not cast.** `src/schemas/content-schema.ts` validates every file against strict Zod schemas, so a missing field, a misspelled key, an unpadded date, or a tech stack slug with no icon fails the build, naming the file and the field.
  The post and project types in `src/models` are derived from those schemas.
- **Frontmatter is YAML 1.2.** `parseFrontmatter` (`src/lib/frontmatter.ts`) splits it off with the `yaml` package, so an unquoted `2023-03-20` stays a string rather than becoming a UTC Date, and quoting a date is a matter of style.
- **Unknown slugs return null** rather than throwing, and the `[slug]` pages turn that into a 404.
  Wrapping the readers in a try/catch that returns null would make a malformed file build as a 404 instead of failing.
- **Readers are memoized per request** with React's `cache()`, so `generateMetadata` and the page share one file read.
  List readers return metadata only, never MDX bodies, because the portfolio list is a client component.
- **Only `.mdx` files are content**, so a stray `.DS_Store` cannot break the build.
- **Dates** go through `parseContentDate` (`src/lib/date.ts`), which reads `YYYY-MM-DD` as local midnight.
  `new Date('YYYY-MM-DD')` is UTC and renders the previous day anywhere west of UTC.
- **Tech stack** slugs are the keys of `src/data/tech-stack.ts`, which holds each icon, brand colors, and display label.
- **Platforms** are the keys of `src/data/platforms.ts` (`web`, `ios`, `game`), at least one per project.
  They drive the portfolio list's filter and are shown in the order that file declares them, whatever order the frontmatter lists them in.
- **Thumbnails** must be `https://ik.imagekit.io` URLs, the one host `images.remotePatterns` in `next.config.mjs` allows; next/image refuses any other.
- **Topics** become URL slugs through `toTopicSlug` (`src/lib/topics.ts`) and get statically generated pages at `/blog/topics/[topic]`.
  Correcting a topic's name moves its page, so `next.config.mjs` redirects the old slug, as it does `nextjs` and `nodejs` since they became Next.js and Node.js.
- **A project that grows into another** takes over its case study rather than sitting beside it, and `next.config.mjs` redirects the old slug, as it does `iconio` since Icon.io became Zumpo.
- **Role and team** are optional, for team projects: `role` names the part Ryan played, and `team` the team's name and its site.
  A solo project leaves both out and says so in its first paragraph.
- **A case study's sections are its own.** Each opens with what the project is, who it is for, and why it exists, then gives two to four `h2`s named for what sets it apart, then its screenshots.
  A list of what Ryan did belongs only in a team project, where it separates his part from the team's.
- **Headings are in sentence case**, in content and on the site alike: "One ledger, two apps", "Featured projects".
  Post and project titles are names, and keep Title Case.
- **Featured:** projects flagged `featured` appear on the home page.
  For posts, the flagged ones do, or the two newest when none are flagged, so flagging one post replaces both.

Reading time is derived, never authored.
`getReadingTime` (`src/lib/reading-time.ts`) runs inside `getPostBySlug` and scores prose at 220 wpm and fenced code at 40 lines a minute, since counting code as prose badly overstates a code-heavy post.

The [admin portal](#admin-portal) writes these same files, through GitHub.
`src/lib/collections.ts` names the two directories for it; `src/lib/content.ts` spells them out again, because the bundler only scopes file tracing to paths it can read statically, and otherwise ships the whole project with every server function.

Posts are compiled with `compileMdx` (`src/components/mdx/mdx-components.tsx`), which runs `@mdx-js/mdx`'s `evaluate` and also returns the post's `h2`s for the table of contents.
Compiled MDX runs as code on the server, and the admin portal compiles drafts to preview them, so a remark plugin refuses any JavaScript first: imports, exports, `{expressions}`, and expression or spread attributes, naming where.
Components take literal attributes only, such as `<Callout type="warning">`; a literal brace in prose is written `\{`.
A rehype plugin placed directly after rehype-slug collects them, so the ids are the rendered ones; do not re-derive them from the Markdown.
The table of contents shows beside posts from `xl` up; the reading progress bar is a CSS scroll-driven animation in `globals.css` with no JavaScript.
Project pages compile the same way, and show the table of contents in the right-hand gutter once a case study has more than one `h2`.

### Portfolio layout

The portfolio has two list layouts and two ways to show a project's tech stack, and `src/data/portfolio-layout.json` picks one of each:

- `list`: `thumbnails`, a timeline grouped by year with a small thumbnail on each row, or `timeline`, text rows whose hovered project shows its thumbnail in the right-hand gutter, in one fixed spot level with the top of the list, so it never runs past the list onto the footer.
  The gutter only exists from `xl` up, and touch screens have no hover, so below `xl` `timeline` shows the rows as `thumbnails` does.
  Below `sm` the year takes its own line above its rows instead of a column beside them, so each row gets the phone's whole width.
  Both have the platform filter above them.
- `stack`: `icons`, each technology with its brand icon, or `badges`, outlined text pills.

It is a file rather than a database setting so that every public page stays static and CI builds with no database.
`src/lib/portfolio-layout.ts` parses it when the module loads, so an invalid file fails the build instead of falling back.
The [admin portal](#admin-portal) changes it by committing to `main`, so a switch shows once that deploy has finished.

The experience timeline is data, not MDX: `src/data/experience.ts`, kept in order by hand.
Each entry has a `kind`, `work`, `co-op`, or `education`, and `src/lib/experience.ts` reads the `work` entries for what the rest of the site says about the job.
The ongoing one is the current role the home page's About me, its JSON-LD `worksFor`, and the site's meta description name, and the first one's start is where the home page's years of experience count from.
So a new job is one entry here; the build fails if no `work` entry is ongoing.
Each entry's `mark` is the organization's logo from `src/assets/logos`, cropped to a circle.
Every logo is a 64x64 tile: the organization's own mark, taken from its website and centered on its brand color, so it reads in both themes.
Marks are centered optically, not by bounding box: each sits three quarters of the way from its box's center toward its center of mass, which is what keeps a bottom-heavy mark like Adobe's "A" from looking low.
An organization with no public logo gets a react-icons icon in an outlined circle instead.
The home page shows the timeline collapsed to its first two entries by `Expandable`, fading out above a button that says how many more there are and expands and collapses it; collapsing scrolls the page with it, so the button stays where it was clicked.
It collapses by entry rather than to a fixed height, which would land somewhere new with every change to the text and at every screen width, sooner or later on the next logo's top edge.
Without JavaScript the timeline shows in full: the entries are hidden only under the `scripting:` variant in `globals.css`.

## Styling

Tailwind 4 is configured entirely in CSS; there is no `tailwind.config.ts`.
`src/styles/globals.css` is the single entry point:

- The theme lives in `@theme inline`.
- Dark mode is a `@custom-variant` matching the `.dark` class next-themes sets.
  Visitors start on their system's setting, and the footer's Light, System, and Dark radios override it; the choice is kept in localStorage as `rg-theme`.
- `mdx.css` is `@import`ed there rather than from components, because v4 `@apply` needs a shared context.
- The `color-level-*` helpers are `@utility` rules.
  Every step holds 4.5:1 on its background in both themes except `color-level-6`, which is only for disabled text; dark `color-level-5` is an arbitrary `oklch(63% 0 0)` for that reason.
- Links draw keyboard focus as a 2px outline in the ring color, set off 2px from their text, within the space between words, in `globals.css`; buttons and fields draw the same color as a ring inside their own padding.
- Greys come from the `neutral` scale, and nothing else: no `gray`, `zinc`, `slate` or `stone`, which are each tinted.
  `ArticleBody` sets `prose-neutral`, because the typography plugin's default `gray` is tinted blue.
  The shadcn/ui variables are on shadcn's neutral theme, except that the dark surfaces keep the site's own 10% background, with fills at 20% and borders at 25%.
- There is one link style: `linkClassName` and `linkArrowClassName` in `animated-link.tsx`, which MDX links (`mdx/custom-link.tsx`) reuse without `inline-block` so they wrap inside prose.

Do not "modernize" `rounded-sm` to `rounded-xs`: the theme overrides `--radius-sm` to 4px, and the rename would silently fall back to the 2px default.

Image `sizes` must describe the rendered width, or next/image serves its largest variant.
Content-width images use `contentImageSizes` from `src/data/site.ts`; `%` is not a valid `sizes` length.
Only a project's hero image is `preload`, which replaced next/image's deprecated `priority`.
Every image a reader waits for, from the portfolio thumbnails to MDX screenshots and the byline avatar, renders through `FadeInImage` (`src/components/fade-in-image.tsx`): a blurred copy of itself until it loads, then a 300ms fade in.
A `preload` image does not fade; it shows over the blur as it arrives.
The fade holds an image at `opacity-0` until hydration, and a hidden image does not count as painted, so the hero, a project page's Largest Contentful Paint, waited on the scripts: about two seconds after the image itself had arrived, with a slow phone's CPU and network emulated, and a desktop Real Experience Score of 55 against 97 to 100 for the other public pages.
The copy is a 16px-wide version ImageKit makes on request, fetched by `getImagePlaceholder` (`src/lib/image-placeholder.ts`) while the page builds and inlined as a data URL of about 100 bytes; it needs a server component, so the portfolio page passes the list's thumbnails theirs as props.
If that fetch fails, the build warns and the image falls back to a grey pulsing `skeleton`.
The wrapper is a block, as Tailwind's preflight makes every `<img>`, so it takes the image's margins and lays out exactly as the bare image did.
An image with no known size holds a shape while it loads: a project's hero is declared 1536 by 936, the size of every thumbnail, and an MDX image holds 8:5, the shape of most screenshots, so a 16:9 one shifts slightly once it arrives.
Do not use next/image's own `placeholder="blur"`: it paints the blur as the image's background, which the fade hides along with the image, and given a path instead of a data URL, as `/blur.svg` once was, it renders nothing at all.
`images.qualities` is set explicitly in `next.config.mjs`, because Next 16 defaults to `[75]` and project and post images render at `quality={95}`.

An MDX image opens full size in the image viewer (`src/components/image-viewer`) when clicked.
`ArticleBody` provides it, so it works the same in posts, projects, and the admin preview; outside a provider an image is only an image.
The viewer browses every image in the same `data-image-gallery` element, reading each from its button's `data-viewer-src`, so a gallery layout only needs to keep that attribute.
It is a native `<dialog>` opened with `showModal()`, which gives the top layer, focus containment, and Escape for free, and it closes back onto the image the reader ended on.
It has one look in both themes, a dark translucent overlay over the blurred page, chosen over a light variant so a screenshot always sits on the same ground.
Its zoom maths lives in `geometry.ts`, unit tested apart from the component; zoom counts device pixels, so on a Retina screen "actual size" is one image pixel to one screen pixel, not two.
The full image is the ImageKit original, not a next/image variant, so the zoom has real detail; it loads over the page's own copy, which shows at once.
On a touch screen a swipe moves between images, a pull down closes, and a double tap or a pinch zooms; a mouse drag only moves a zoomed image.

Images written on consecutive lines, with no blank line between them, are one Markdown paragraph, and `groupImages` (`src/components/mdx/group-images.ts`) turns such a paragraph of two or more images into an `ImageGallery`.
So a project's screenshots form a gallery with nothing new in the content, and an image on its own stays a full-width image.
On a phone a gallery stays one image per row; from `md` up the first image spans the column and the rest sit two to a row, cropped to 8:5 from the top, and when an odd number follow the first, the last spans the column too.
Each image in a gallery is captioned with its alt text, so alt text there has to name what the screenshot shows, not "Screenshot 1".
A caption wraps rather than truncating.
A tile's `sizes` is its 314px, not the column's 644px.

A code block (`src/components/mdx/custom-pre.tsx`) is padded `px-4`, the same as its header, so the code lines up under the language icon and an 80-column line, the longest Prettier writes, fits the 644px column without scrolling.
At `px-5` such a line overflows by 4px and its last character is clipped.
Code is highlighted by rehype-pretty-code with shiki's `min-light` and `min-dark`, on the page's own background (`keepBackground: false`).
Their comments, #c2c3c5 and #6b737c, hold only 1.8:1 and 3.6:1 there, so `src/components/mdx/code-themes.ts` recolors them to `color-level-5`'s greys, 4.7:1 and 5.0:1, and leaves every other token alone.
Shiki colors tokens with inline styles and no class names, so a comment cannot be targeted from CSS; the fix has to be in the theme.
`shiki` is a direct dependency for the theme files, and must stay within rehype-pretty-code's peer range.

From `xl` up, posts and projects share one layout, with both gutters 192px wide so the column sits centred between them.
The left-hand gutter holds the back link (`navigation/back-button.tsx`) at `right-full mr-10`, and the page's facts under it, passed in as the back link's children: a post's publish date, reading time, views, and topics (`blog/post-facts.tsx`), or a project's role and team when it has them, year, platforms, links, and stack.
The back link and the facts are one rail that sticks at `top-32`, so the way up stays in reach down a long page.
Facts taller than the window scroll on their own; at 800px tall every post's and project's fit whole, which `e2e/blog.spec.ts` and `e2e/portfolio.spec.ts` check.
The gutter spans the page's height and lets clicks through, and only the rail takes them, since a gutter laid over the link takes its clicks.
The right-hand gutter holds the table of contents (`navigation/contents-gutter.tsx`), once a page has more than one `h2`, sticking at `top-32` level with the back link.
It also holds the `timeline` list's hovered thumbnail and, on every page, the back-to-top link, which shows 64px above the bottom of the window.
So the table of contents is at most the window's height less 240px and scrolls on its own past that, ending clear of the link; the tests check that too.
A rail that scrolls hides its scrollbar, which on classic-scrollbar systems would draw a track down the gutter and take 15px of its width, and fades out at the edge it has more to scroll to instead (`gutter-scroll` in `globals.css`).
Chrome keeps that fade after the window grows tall enough for the rail to fit, until the page reloads.
Below `xl` a project's facts sit under its title instead, and a post's byline carries its date, reading time, and views; the admin preview, which has no gutter, always shows them there.
A post's topics stay at its end as well, where a reader who finished it looks for more.
In the gutter a project's links show their address, from `lib/display-url.ts`: a GitHub repository as `owner/repo`, an itch.io game as `itch.io/game` without the uploader's subdomain, and an address too long for the 192px gutter wraps only after a `/`, never at a hyphen.
Everything in the right-hand gutter sits at `left-full ml-10` of the content column; `back-to-top.tsx` is fixed-position, so it repeats that offset as `calc(50% + 362px)`, and both change together if the column's width does.
Below `xl` there are no gutters: the back link sits above the page's title, with its tap area grown to 44px, and back to top is a round button in the corner, above the footer.
From `lg` up to `xl`, a page keeps its table of contents in the right-hand gutter while its facts go under the title.
The left-hand gutter is too narrow for the facts there, so the column and the contents, 876px together, are centred as a pair: `globals.css` moves the column and the footer 116px left on any page with a `data-contents-gutter`.
At 1024px that leaves 74px either side, room enough that the text never runs close to the window's edge; narrower than that there are no gutters at all.
Pages without a table of contents stay centred, so moving between a list and a post in that range moves the column sideways, under the page cross-fade.

## Routing and SEO

Use `AnimatedLink` with `isExternal` for anything that is not a page of this site, including same-origin files.
It renders a plain anchor, because next/link prefetches any same-origin href in view and would download the resume PDF for every visitor.
Links in MDX follow the same rule by themselves through `mdx/custom-link.tsx`: a page of this site, written as `/portfolio/...` or in full as `https://ryangan.me/...`, opens in place through next/link, and anything else, a path with a file extension included, opens in a new tab as a plain anchor with the arrow.

Pages cross-fade through React's `<ViewTransition>`, which `PageTransition` (`src/components/page-transition.tsx`) wraps around the page in the root layout; links are plain `next/link`.
It is keyed by the path, so a new page is an exit and an enter, each a fade in place.
Unkeyed, a new page was an update, which also slides and resizes the page's box from the old page to the new one: leaving a page far down looked like the new page scrolling up from below.
Everything else that runs in a transition is an update, and `default="none"` keeps it still: `InPageLink` pushing a hash went through Next's router and cross-faded the whole page, so the columns either side flickered on every table of contents click.
Next renders a back or forward at once, without a cross-fade, so the browser puts the reader back where they were.
Do not bring back `next-view-transitions`: it holds the page back after the browser's Back button until it has snapshotted the old one, so the browser restores the scroll position against the page being left and every back or forward lands at the top.

The back link at the top of each page is a link up to its parent, such as Portfolio from a project.
When the parent is the page the reader just came from, it goes back in history instead, so the parent returns as it was left and the browser's Back button does not then lead into the child again.
It asks the Navigation API (`navigation.entries()`) what the previous page was; without that API it is always a plain link up.
`e2e/navigation.spec.ts` covers both ways and the scroll position.

The page does not scroll smoothly as a whole: there is no `scroll-smooth` on `<html>`, so Back and Forward put the reader where they were on the first frame instead of scrolling there from the top, and a new page starts at the top at once.
A new page starts at the top because of `NewPageAtTop` (`src/components/new-page-at-top.tsx`) in the root layout, not Next alone.
Next scrolls to the top only when it cannot see the new page's top, and the layout's padding sits above every page, so a page that scrolls by less than that padding, reached from far down another, kept the scroll the browser clamped it to.
The component skips Back and Forward, which Next renders in a transition after `popstate`, and links with a hash, which Next scrolls to.
`e2e/navigation.spec.ts` sizes the window just under the blog list's height to check it.
Links within a page scroll smoothly by themselves through `InPageLink` (`src/components/in-page-link.tsx`): the table of contents, and every `#` link in MDX by way of `mdx/custom-link.tsx`, such as heading anchors and footnotes.
It does what Next does for a hash link, a history entry pushed with `history.pushState`, then `scrollIntoView`, then focus on the section, but smoothly; for a reader who asks for reduced motion it leaves the click to the browser, which jumps.
Link to a part of the same page with `InPageLink`, not a plain anchor or `next/link`, or the jump is instant.
`e2e/navigation.spec.ts` samples the scroll position on every frame to check both: Back lands at once, and the table of contents scrolls smoothly unless motion is reduced.
It also records the view transitions, which the scroll position does not show: none on a table of contents click, and on a new page, no box that moves.
A table of contents click marks its entry at once, and the facts that follow the section (the design history's) switch with it, rather than both stepping through every section the jump passes.
The entry stays marked until the reader scrolls on their own, during the jump or after it comes to rest, since at rest the scroll alone may not name it: a short last section never reaches the line.
One marker slides between entries instead of each entry's edge lighting up, and the same test watches `aria-current` to check that only the clicked entry is ever marked.

### No loading.tsx, on purpose

There is deliberately no root `loading.tsx`.
Every public route is Static or SSG and links prefetch by default, so the RSC payload is already cached when a link is clicked; a loading boundary had nothing to fill on a normal navigation (measured: zero fallback renders across a real client-side transition).
What it did do was render the fallback client-side whenever hydration ran slowly, flashing a full-page "Loading" screen mid-article at random.
It also fought the view transitions: animating into a loading screen and back out looks worse than not animating.

If a genuinely slow route is ever added, give it a scoped `loading.tsx` in that segment, and prefer a top progress bar over a layout-replacing spinner.
The admin pages are the one case: they wait on GitHub, so `src/app/admin/loading.tsx` shows a bar across the top.
The bar is fixed to the window but sits inside an empty block in the content column, where every page starts.
Because they stream, an admin URL that does not exist answers 200 with the not-found page, the status having gone out before the page decides; behind sign-in and `noindex`, that costs nothing.

### Not found

`src/app/not-found.tsx` renders for every unmatched URL and every `notFound()`, such as an unknown post slug, inside the root layout.
It answers with a 404 status, and Next adds `noindex` on its own.
It titles unmatched URLs "Page not found"; the `[slug]` pages give their own misses a more specific title.
It lists the site's sections with `LinkRows`, the home page's list of featured projects and posts, so a dead link still leads somewhere.
`LinkRows` runs each row's rule on from the title's last word and sets the year or path level with that line, so a title that wraps on a phone still reads as one row.
The rule holds on to that word and never shows shorter than 16px; a line too full for both carries them to the next line together.

### Metadata

`metadataBase` and the site constants come from `src/data/site.ts`.
Every page sets a description, a canonical URL, and OpenGraph tags.
Page titles come from `pageTitle`, the page's name and then "- Ryan Gan"; only the home page's, `siteTitle`, differs.
The site also publishes `sitemap.xml` (including topic pages), `robots.txt`, a web manifest, an RSS feed at `/feed.xml`, and JSON-LD: a Person on the home page and a BlogPosting on each post.
Vercel Analytics and Speed Insights load from the root layout.
The admin pages are `noindex` and disallowed in `robots.txt`.

## Database

Neon Postgres, through Prisma 7.
Older Prisma recipes do not apply:

- The connection URL is **not** in `schema.prisma`; it is in `prisma.config.ts`, pointed at `DATABASE_URL_UNPOOLED`, because migrations take advisory locks that do not survive a transaction pooler.
  That config resolves `env()` eagerly, even for `prisma generate`, which never connects, so a deploy setting only `DATABASE_URL` would fail at the generate step.
  Hence the fallback to `DATABASE_URL`, which keeps production down to one variable.
  Runtime reads only `DATABASE_URL`; `DATABASE_URL_UNPOOLED` is CLI-only.
- The generator is `prisma-client` (not `prisma-client-js`) and requires an explicit `output`.
- Every database needs a driver adapter.
  `src/lib/db.ts` uses `PrismaNeon` against the pooled endpoint, so serverless cold starts cannot exhaust a TCP pool.
- **Database errors are logged through `describeError`** (`src/lib/describe-error.ts`).
  A failed connection rejects with the WebSocket's `ErrorEvent`, not an Error, which logs as a bare `ErrorEvent { type: 'error' }`.
  The driver is given the `ws` package because Node's built-in WebSocket withholds the reason; with `ws`, the log names it, as in `WebSocket error: getaddrinfo ENOTFOUND db.invalid (wss://db.invalid/v2)`.
- **The build runs `prisma generate` itself.** The client is generated into `src/generated/prisma`, which is gitignored, so a fresh clone does not have it.
  `postinstall` also generates, but only on a real install: pnpm 12 skips the install, lifecycle scripts included, when `node_modules` is already current, and a restored Vercel build cache is exactly that.
  Relying on `postinstall` alone fails every deploy after the first; CI deletes the generated client before building to catch it.
- `User`, `Account`, `Session`, and `Verification` are Better Auth's tables behind the [admin portal](#admin-portal)'s sign-in.
  Their columns keep the snake_case names they had under Auth.js, through `@map`.
  Nothing writes to `verifications`, since OAuth state rides in a cookie, but Better Auth's Prisma adapter refuses to start without it.
  There is no guestbook: its never-built `guestbook_notes` table, always empty, was dropped from both Neon branches on 2026-10-19, since a portfolio's visitors rarely sign one and an empty one reads as nobody visiting.

The database is only ever an enhancement: the site builds and runs with no database reachable.
`.env.example` documents every variable.
Next loads `.env` for the app; `prisma.config.ts` loads it for the Prisma CLI with Node's `process.loadEnvFile`, and only when the file exists, since CI and Vercel set their variables directly.

## Post views

Views live in the same Postgres database as everything else (`src/lib/views.ts`); a second datastore would buy nothing once comments are also read per page.

- **Fails soft.** Any database error resolves to `null`, and `PostViewCount` renders nothing, separator dot or gutter row included.
  That is also the state before the tables exist.
- **Hidden while small.** `PostViewCount` shows the count only from 100 views (`MIN_VIEWS_SHOWN`), since a small number reads as nobody reading; every view is still recorded.
- **Counted client-side, once.** Posts are static, so `PostViews` calls `recordPostViewAction` on mount, guarded by a ref so Strict Mode does not double-count, and shares the total with the count under the title and the one in the gutter.
  Each recording its own view would count a first visit twice, since the two requests would race and each mint a session cookie.
  The action validates the slug against `getAllPostSlugs()` because a server action is a public endpoint.
- **Deduped by session, not IP.** An IP is personal data, is shared behind a NAT, and follows people between networks.
  The action mints an opaque id into an httpOnly `pv_session` cookie with no `maxAge`, so it dies with the browser.
- **Dedup is a database constraint.** `PostViewSession` is keyed on `(sessionId, slug)` and the insert uses `skipDuplicates`; whether a row was written decides whether the total increments.
  Catching a unique violation instead would abort the surrounding transaction and leave nothing to read.

Sessions are kept for 30 days.
Each newly counted view deletes older ones, through the `viewed_at` index, so the table stops growing without a cron; a session that returns after a month counts once more.

Loading a post in `pnpm dev` records a view in whatever database `DATABASE_URL` points at, and signing in to the admin portal writes to `users` and `accounts` there.
The local `.env` points at the Neon `dev` branch (`ep-misty-dawn`); production is the `main` branch (`ep-bold-field`).
Its direct URL lives in the main checkout's gitignored `.env.prod.local` as `DATABASE_URL_UNPOOLED`, readable only by its owner.
Keep that file after a production change: Vercel holds the production `DATABASE_URL` as a sensitive variable, which `vercel env pull` cannot read, so the file is the only local way to reach production.
Check the host is `ep-bold-field` before writing through it, since the two branches' URLs differ only there.
To test pages without writing, run the dev server with `DATABASE_URL` pointed at an unreachable host; the counter fails soft.

## Contact form

The action is a public endpoint that sends email, so it has three layers:

- The Zod schema bounds every field.
- A hidden `website` honeypot field; a filled one gets a fake success, since telling a bot it was caught teaches it what to change.
- A rate limit of 3 submissions per 10 minutes per caller (`src/lib/rate-limit.ts`), counted in the `contact_submissions` table so it holds across serverless instances.
  The caller key is a SHA-256 of the IP, never the address, and rows older than a day are pruned.
  If the database is unreachable or the table does not exist, it falls back to an in-memory count and logs why, rather than failing the form.

Email goes through Resend.
`CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` set the addresses.
The default sender is Resend's shared sandbox, which only delivers to the account owner.
In Vercel's dashboard, enter `CONTACT_FROM_EMAIL` without surrounding quotes: unlike a `.env` file, it keeps them, and Resend rejects the quoted address.

The email (`src/email/contact-form-email.tsx`) is built with react-email and uses only what mail clients render: a system font stack, pixel units, and the logo as the PNG icon on the live site, since Gmail drops SVG.
The message keeps its line breaks, the inbox preview is the start of the message, and the reply button and `replyTo` both reach the sender.
Resend renders only HTML from `react`, so the action also sends `contactFormEmailText` as the plain-text part.

On the page, each field is a row with its label in a left column, like the blog archive.
The rule under a row sweeps in from the left while its field has focus, and stays drawn in red while the field is invalid.
The send button sits inside the message row, so a row counts as focused only while its own input or textarea is, not the button.
The inputs are plain elements rather than the shadcn primitives, since those draw a box the row replaces.
The form is `noValidate`, so every invalid field gets the same inline message instead of some getting the browser's tooltip.
The profiles listed under the form come from `authorProfiles` in `src/data/site.ts`, which the home page's JSON-LD also uses.
`SocialIcon` draws every social icon from Tabler's outline set, whose stroke matches the Lucide icons beside them; mixing sets is what made the old icons look uneven.

## Admin portal

`/admin` is where Ryan writes posts and adds projects without editing MDX by hand.
Content stays in the repository: the portal is a form over the same files, and GitHub is its only store.

- **A draft is a pull request.** Saving commits the item's file to the branch `content/<collection>/<slug>` and opens a pull request into `main` the first time, so every draft gets CI; Vercel builds no preview for it (see [Tooling and deploy](#tooling-and-deploy)).
  Publishing saves, then squash-merges it and deletes the branch, and Vercel deploys `main`.
  Discarding closes the pull request unmerged.
  A branch whose pull request is no longer open is a leftover, and the next save resets it to `main`.
- **Nothing saved elsewhere is overwritten.** The editor keeps the blob id of the file it loaded and sends it with every write, so GitHub refuses a save over a newer version; publishing passes the commit it saved last, so GitHub refuses to merge anything unseen.
- **Publishing waits out GitHub.** For a few seconds after a push, the pull request still reports its previous head, and the merge API answers 409 or 405.
  `publishDraft` (`src/lib/admin/repository.ts`) retries while the branch still holds the saved commit, and only a moved branch or a real conflict with `main` fails.
- **Files are written exactly as a hand-formatted one.** `src/lib/admin/content-file.ts` writes frontmatter in schema order and flow style, and `src/lib/admin/format.ts` runs Prettier's standalone build with every built-in language, so code blocks are formatted too.
  The standalone build cannot load the Tailwind plugin, which reads the stylesheet from disk, so `prettier.config.js` leaves class sorting out of MDX for the CLI as well; otherwise a saved file could fail `format:check`.
  A test writes every existing content file back byte for byte, and compares the output with the CLI's.
- **The preview is the page.** `renderContentPreview` (`src/components/admin/content-preview.tsx`) renders the item with the post and project pages' own `PostHeader`, `ProjectHeader`, and `ArticleBody` and the MDX pipeline.
  The editor pages render it too, for the preview they open with, and that is load-bearing: a server action can only return client components (the code block's copy button, `next/link`, `next/image`) that the calling page's module graph includes.
  The pages pass it as a `ContentPreview` element rather than a rendered tree, which spares React's development build a false missing-key warning.
- **Unsaved work survives in the browser.** The editor keeps a copy of unsaved changes in `localStorage` and offers it back, so a closed tab or an expired sign-in loses nothing; it also warns before leaving with unsaved changes.
- **Images upload straight to ImageKit** from the browser, signed by a server action (HMAC-SHA1 of a one-time token and expiry under `IMAGEKIT_PRIVATE_KEY`), so files never pass through a server action's 1 MB limit.
  Without `IMAGEKIT_PUBLIC_KEY` and `IMAGEKIT_PRIVATE_KEY` the upload buttons are hidden and image URLs can still be pasted.
  Posts upload into `/Blog/<slug>` and projects into `/Project Screenshots/<slug>`, where the existing screenshots are.
- **The portfolio layout commits straight to `main`.** The dashboard's layout form writes `src/data/portfolio-layout.json` with no draft, since it is one setting and only the redeploy shows it; see [Portfolio layout](#portfolio-layout).
  It sends the blob id it loaded, like the editor, so a change made elsewhere since is refused rather than overwritten.
  The form says when `main` is ahead of what this deploy was built with.
- **Design history is a record kept by hand.** `/admin/history` shows each layout, structure, or visual overhaul big enough to remember, with what it was built with and screenshots in light and dark, from `src/data/design-history.ts`.
  The screenshots come from running that version's commit in `next dev`, at 1440x900 and 2x (a whole page at 1.5x, since ImageKit serves no original over 25 megapixels), and live on ImageKit under `/Design-History/<version>` with the dot as a dash, since ImageKit refuses a dot in a folder name.
  A new version is a new entry at the end; most changes are not one.
  It is laid out like a post: the versions are its table of contents, and the left-hand gutter shows the facts of the version in view, which `DesignFacts` reads through the table of contents' own `useActiveHeadingId`.

### Sign-in

Better Auth (`src/auth.ts`) with GitHub as the only provider, sessions in the `sessions` table, and the Prisma adapter.
The server calls it through `getAuth().api`, which creates it on first use: Better Auth checks its secret as soon as it is created, and the build, which imports it from every admin route, has none. The only route it serves over HTTP is GitHub's callback, `src/app/api/auth/callback/github/route.ts`, so the rest of its endpoints do not exist.

- **The provider is a GitHub App**, "Ryan Gan Portfolio Admin", installed on this repository alone, with read and write access to contents and pull requests and read access to email addresses.
  Its token reaches this one repository, where an OAuth App's `public_repo` token could write to every public repository the account has.
  It needs `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`, and `AUTH_SECRET` signs the session cookie and encrypts the OAuth state cookie.
- **Only someone who can push to the repository gets in.** The provider's `getUserInfo` asks GitHub before Better Auth writes anything, and returning nothing refuses the sign-in, so it leaves no row behind.
  A refused sign-in comes back to the sign-in page with `error=unable_to_get_user_info`.
  Every other failed callback lands there too, through `onAPIError.errorURL`, since Better Auth's own error page is not served.
- **Admins get the `ADMIN` role** from a `session.create.before` hook, since only someone the gate let through ever gets a session.
  `getUserInfo` cannot set it: Better Auth drops fields marked `input: false` from what a provider returns, which is what keeps a visitor from setting their own role.
  Every admin page and server action checks the role itself with `requireAdmin` or `getAdmin`: a layout does not protect server actions, which are public endpoints.
- **Sessions are rows**, valid for a week, so deleting a row signs that browser out.
  Signing out deletes the row.
- **The portal commits as the signed-in user**, with their GitHub token from `accounts`.
  Better Auth stores a fresh pair on every sign-in.
  GitHub App tokens expire after eight hours; `getGitHubToken` (`src/lib/admin/github-token.ts`) refreshes them a minute early, and asks for a new sign-in once the refresh token is spent.
- **The base URL** is `BETTER_AUTH_URL`, or else the live site in a production build and `http://localhost:3000` otherwise.
- **The callback URLs** registered on the app are `https://ryangan.me/api/auth/callback/github` and `http://localhost:3000/api/auth/callback/github`, so sign-in works locally only on port 3000.

## Security headers

`next.config.mjs` sends `nosniff`, a referrer policy, `frame-ancestors 'none'` with `X-Frame-Options: DENY`, and a permissions policy on every route, and turns off `X-Powered-By`.
Because of `frame-ancestors`, the site cannot be embedded in an iframe, including by itself.

- **HSTS** is left to Vercel, which already sends it.
  Adding `includeSubDomains` or `preload` would commit every subdomain to HTTPS.
- **No script CSP.** Next and next-themes inline scripts, so a CSP would need a per-request nonce, turning every static page dynamic.

## Brand mark

The icon is the letter **R** from Geist SemiBold knocked out of a squircle, shipped as outlines so nothing depends on font loading.

- The path lives in two places that must stay in sync: `src/app/icon.svg` and `R_PATH` in `src/components/logo.tsx`.
- `logo.tsx` exports `R_PATH` and `TILE_PATH`, which the OpenGraph cards also draw with: the site's (`src/app/opengraph-image.tsx`) and each post's (`src/app/blog/[slug]/opengraph-image.tsx`).
- `Logo` renders `variant="tile"` and `variant="mark"`, both painting with `currentColor` so they invert with the theme.
- Geometry is normalized to a `100x100` box: tile corner radius `24`, glyph ink box `56` tall, centered on `(50, 50)`.

The site's OpenGraph card is drawn at build time like the posts', with the home page's tagline in Newsreader italic.
Satori reads only TTF, OTF, or WOFF, and next/font ships woff2, so that face comes from `@fontsource/newsreader` and Geist from the `geist` package.
The Ryan Gan Portfolio project's thumbnail, on ImageKit, is the same tile over the same tagline on white, so it needs redrawing when either changes.

Regenerate by extracting `R` from `node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf` with `fontTools`.
Derived assets: `icon.svg`, `favicon.ico`, `apple-icon.png` (180x180, square, no alpha), `public/icon-{192,512}.png`, and `public/icon-maskable-512.png` (glyph at `0.40` to survive Android's safe-zone crop).

Traps when regenerating:

- Knockout letters need more weight than positive ones, hence SemiBold even though headings are Medium.
- Pillow drops any ICO frame larger than the base image, so save from the 256px frame with the rest in `append_images`.
- Every ICO frame must be RGBA; Turbopack refuses to decode grayscale with alpha.

## Tooling and deploy

Vercel deploys `main` and builds nothing else: pull requests get no preview deployment.
The project's Ignored Build Step, set in the Vercel dashboard under Settings > Git rather than in a `vercel.json`, is `if [ "$VERCEL_ENV" == "production" ]; then exit 1; else exit 0; fi`, which cancels every build that is not production.
This is deliberate: CI already builds the site and runs the browser tests against that build on every pull request, so a preview build would only spend build minutes.
A pull request's Vercel check reads "Canceled by Ignored Build Step" and still passes; that is expected, not a fault to fix.
CI (`.github/workflows/ci.yml`) runs format check, lint, typecheck, unit tests, build, and browser tests on every pull request and push to `main`, from a clean install with no secrets.
`pnpm typecheck` runs `next typegen` first: `next-env.d.ts` and the route types are generated and gitignored, and CI type-checks before it builds, so without them a clean checkout cannot resolve imports such as `*.svg`.
Dependabot opens dependency updates.

pnpm is pinned by `packageManager` in `package.json`, and pnpm 10 and later switch to that version on their own, so local installs, CI, and Vercel resolve with the same pnpm.
pnpm 11 and later no longer read the `pnpm` field in `package.json`; the settings live in `pnpm-workspace.yaml`:

- `allowBuilds` (and `onlyBuiltDependencies`, the pnpm 10 spelling) lets only Prisma run install scripts.
- `peerDependencyRules` accepts ESLint 10 for three plugins that have not declared it yet; see below.

### Pinned versions

- **ESLint 10 ahead of its plugins.** ESLint 9 is out of support, but `eslint-plugin-react`, `-import`, and `-jsx-a11y` (via `eslint-config-next`) have not released ESLint 10 peer ranges.
  `peerDependencyRules` accepts 10 for those three.
  `eslint-plugin-react`'s React version detection calls the removed `context.getFilename()`, so `eslint.config.mjs` sets `settings.react.version` from the installed React.
  Drop both workarounds as the plugins catch up.
- **TypeScript 6.0.3.** TypeScript 7.0 ships no programmatic JS API, so typescript-eslint cannot load and `pnpm lint` fails, even though `next build` itself runs on 7.0.
  Revisit at 7.1; Dependabot ignores TypeScript majors until then.
- **Prisma 7.** Prisma 8 is published under `latest` but is still a release candidate.
- **Runtime dependencies that look like dev tools.** `prettier` and the rehype and remark plugins are `dependencies`: the admin portal formats and compiles MDX at request time, not only in the build.

`tests/upstream-pins.test.ts` reads the installed packages and fails, naming what to remove, once a dependency update makes the ESLint or TypeScript workaround unnecessary.
Dependabot's updates are what trip it.

### Tests

- **Unit tests** (Vitest, `pnpm test`) sit beside their code in `src/` and mock the database.
  `tests/` holds checks on the repository itself.
  One is `tests/agent-docs.test.ts`: `AGENTS.md` sends agents to the docs bundled with the installed Next.js, and `agentRules: false` in `next.config.mjs` stops `next dev` from writing its own copy of that pointer into `AGENTS.md` whenever an agent runs it, so the test fails the Next update that moves the docs instead.
- **Browser tests** (Playwright, `pnpm test:e2e`) live in `e2e/` and cover the flows that have broken before: the contact form's states, the theme toggle, client-side navigation, and the 404 page, plus the home page's expandable timeline and back to top, the screenshot gallery's layout, and the image viewer's browsing, zoom, and close.
  For the admin portal they cover what a visitor who is not signed in meets, up to GitHub's authorize URL, which they intercept.
  Past sign-in the portal acts on GitHub as the signed-in user, so its repository calls are unit tested against a fake Octokit instead.

The browser tests run against a production build, since static rendering, prefetching, and the inline theme script only behave as visitors see them there.
`playwright.config.ts` starts that server cut off from everything real:

- `DATABASE_URL` points at a host that cannot resolve, so the view counter and rate limit fail soft, and nothing is written to production.
- Resend is pointed at `e2e/mock-resend.mjs` through `RESEND_BASE_URL`, so no email is sent.
  A subject containing `resend-fail` makes it answer with an error.
- Each contact test sends its own `x-forwarded-for`, so the rate limit, which keys on the caller's IP, cannot leak between tests.
- The sign-in variables are placeholders, and `BETTER_AUTH_URL` is the test server's, so the authorize URL sends GitHub back to it.

Any console error or uncaught exception fails a test, since that is how hydration mismatches surface.
Vercel's analytics scripts, which only exist on Vercel, are answered with an empty script.
Start the server with `next start`, not `pnpm exec next start`: pnpm's native binary does not pass on the stop signal, and Playwright then waits on the orphaned server forever.
