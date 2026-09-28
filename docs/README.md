# Docs

These docs route work on this repository; they are not an archive.
Load only the document and section a request needs.

## Route the request

| Question                                                   | Read                                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| What is done, what is open, and what is waiting on Ryan?   | [status.md](status.md)                                                   |
| Which files does a change touch?                           | [architecture.md#code-map](architecture.md#code-map)                     |
| MDX content, frontmatter, dates, topics, or reading time   | [architecture.md#content](architecture.md#content)                       |
| Tailwind 4, theming, or images                             | [architecture.md#styling](architecture.md#styling)                       |
| Links, navigation, loading states, metadata, feeds, or SEO | [architecture.md#routing-and-seo](architecture.md#routing-and-seo)       |
| Prisma 7, the database, or environment variables           | [architecture.md#database](architecture.md#database)                     |
| The post view counter                                      | [architecture.md#post-views](architecture.md#post-views)                 |
| The contact form                                           | [architecture.md#contact-form](architecture.md#contact-form)             |
| Security headers                                           | [architecture.md#security-headers](architecture.md#security-headers)     |
| The logo, favicons, or OpenGraph images                    | [architecture.md#brand-mark](architecture.md#brand-mark)                 |
| pnpm, CI, deploys, or why a dependency is pinned           | [architecture.md#tooling-and-deploy](architecture.md#tooling-and-deploy) |

List the headings with `rg '^##' docs/architecture.md` and read only the matching section.

## Ownership

- `AGENTS.md` holds commands and the rules that fail silently when broken.
  It loads in every session, so it stays short and links here for the reasons.
- `architecture.md` says how each part works, why it is built that way, and where its code is.
  It holds no history.
- `status.md` says what is true now and what is left.
  Resolved items are deleted, not archived.
- Git commits and pull requests keep the history and the evidence.

Each fact has one owner.
Link to it instead of copying it.

## Updating

- Change the owning doc in the same commit as the code it describes.
- Keep headings stable, since the table above and `AGENTS.md` link to them.
- Add a document only when neither `architecture.md` nor `status.md` can own the information cleanly, and add it to the table above.
