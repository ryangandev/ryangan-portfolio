import { format } from 'date-fns';

import { newsreader } from '@/assets/fonts';
import AnimatedLink from '@/components/animated-link';
import Expandable from '@/components/expandable';
import ExperienceList from '@/components/experience-list';
import JsonLd from '@/components/json-ld';
import LinkRows from '@/components/link-rows';
import SectionHeading from '@/components/section-heading';
import { experience } from '@/data/experience';
import {
  authorAvatarUrl,
  authorProfiles,
  siteName,
  siteUrl,
} from '@/data/site';
import { getFeaturedPosts, getFeaturedProjects } from '@/lib/content';
import { parseContentDate } from '@/lib/date';
import {
  getCurrentRole,
  getSiteDescription,
  getYearsOfExperience,
} from '@/lib/experience';
import { cn } from '@/lib/utils';

/**
 * The entries the timeline shows until it is expanded; `nth-child(n+3)` in its
 * collapsed classes below hides the rest
 */
const COLLAPSED_ENTRIES = 2;

export default async function Home() {
  const [featuredProjects, featuredPosts] = await Promise.all([
    getFeaturedProjects(),
    getFeaturedPosts(),
  ]);
  const currentRole = getCurrentRole(experience);
  const yearsOfExperience = getYearsOfExperience(experience, new Date());

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: siteName,
          alternateName: 'Zhiheng Gan',
          url: siteUrl,
          image: authorAvatarUrl,
          jobTitle: 'Software Engineer',
          worksFor: {
            '@type': 'Organization',
            name: currentRole.organization,
          },
          description: getSiteDescription(experience),
          sameAs: authorProfiles.map((profile) => profile.url),
        }}
      />
      {/* The name and the line under it read as one block, as on the
          site's share image, set apart from the sections below. */}
      <hgroup className="mb-14">
        <h1 className="mb-0.5">Zhiheng (Ryan) Gan</h1>
        <p
          className={cn(
            newsreader.className,
            'mb-0 text-[17.5px] font-medium color-level-2 italic',
          )}
        >
          I am a user before a developer.
        </p>
      </hgroup>

      <h2>About Me</h2>
      <p className="mb-4">
        I&apos;m a software engineer at {currentRole.organization} in{' '}
        {currentRole.location}. I like to craft polished, user-centric software
        that brings satisfaction through every little detail. I specialize in
        full-stack development and have {yearsOfExperience} years of experience.
        My tech stack includes:
      </p>
      <ul className="mb-7 list-inside list-disc space-y-2 pl-5.5 -indent-5.5">
        <li>
          <span className="font-medium color-level-2">Frontend</span>: React,
          Next.js, TypeScript, JavaScript, Redux
        </li>
        <li>
          <span className="font-medium color-level-2">Backend</span>: Node.js,
          Express, Fastify, Java, Spring Boot, PostgreSQL, MongoDB, Prisma
        </li>
        <li>
          <span className="font-medium color-level-2">Tools & Others</span>:
          AWS, CI/CD, Playwright, Jest, Splunk, Git, Docker, Vercel
        </li>
      </ul>
      <p>
        I embrace continuous learning and am constantly picking up new skills.
        Currently, I&apos;m exploring building software with AI coding agents.
      </p>

      <h2>Timeline</h2>
      <Expandable
        collapsedClassName="scripting:[&>ol>li:nth-child(n+3)]:hidden"
        label={`Show ${experience.length - COLLAPSED_ENTRIES} more`}
      >
        <ExperienceList items={experience} />
      </Expandable>

      <SectionHeading more={{ href: '/portfolio', label: 'All projects' }}>
        Featured Projects
      </SectionHeading>
      <LinkRows
        rows={featuredProjects.map((project) => ({
          href: `/portfolio/${project.slug}`,
          title: project.title,
          summary: project.summary,
          end: format(parseContentDate(project.date), 'yyyy'),
        }))}
      />

      <SectionHeading more={{ href: '/blog', label: 'All posts' }}>
        Writing
      </SectionHeading>
      <LinkRows
        rows={featuredPosts.map((post) => ({
          href: `/blog/${post.slug}`,
          title: post.title,
          end: format(parseContentDate(post.publishedDate), 'yyyy'),
        }))}
      />

      <h2>Connect</h2>
      <p>
        Reach me at{' '}
        <AnimatedLink href="mailto:ryangan.dev@gmail.com" isExternal>
          ryangan.dev@gmail.com
        </AnimatedLink>
        , or through my{' '}
        <AnimatedLink href="/contact">contact form</AnimatedLink>. You can also
        view my{' '}
        <AnimatedLink href="/RyanGan_Resume.pdf" isExternal>
          resume
        </AnimatedLink>
        , explore my source code on{' '}
        <AnimatedLink href="https://github.com/ryangandev" isExternal>
          GitHub
        </AnimatedLink>
        , or check out cool components from my previous work in my{' '}
        <AnimatedLink href="https://craft.ryangan.me" isExternal>
          craft collection
        </AnimatedLink>
        .
      </p>
    </main>
  );
}
