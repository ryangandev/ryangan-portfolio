import { format } from 'date-fns';
import { Link } from 'next-view-transitions';

import { newsreader } from '@/assets/fonts';
import AnimatedLink from '@/components/animated-link';
import Expandable from '@/components/expandable';
import ExperienceList from '@/components/experience-list';
import JsonLd from '@/components/json-ld';
import { experience } from '@/data/experience';
import {
  authorAvatarUrl,
  authorProfiles,
  siteDescription,
  siteName,
  siteUrl,
} from '@/data/site';
import { getFeaturedPosts, getFeaturedProjects } from '@/lib/content';
import { parseContentDate } from '@/lib/date';
import { cn } from '@/lib/utils';

export default async function Home() {
  const [featuredProjects, featuredPosts] = await Promise.all([
    getFeaturedProjects(),
    getFeaturedPosts(),
  ]);

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
          description: siteDescription,
          sameAs: authorProfiles,
        }}
      />
      <h1>Zhiheng (Ryan) Gan</h1>

      <p
        className={cn(
          newsreader.className,
          'text-[17.5px] font-medium color-level-2 italic',
        )}
      >
        I am a user before a developer.
      </p>

      <h2>About Me</h2>
      <p className="mb-4">
        I like to craft polished, user-centric software that brings satisfaction
        through every little detail. As a software engineer specializing in
        full-stack development with 4 years of experience, my tech stack
        includes:
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

      <h2>Experience</h2>
      <Expandable
        collapsedClassName="max-h-[26rem] md:max-h-[19rem]"
        label="Expand to view all"
      >
        <ExperienceList items={experience} />
      </Expandable>

      <h2>Featured Portfolio</h2>
      <ul className="group mb-7 text-[15px]">
        {featuredProjects.map((project) => (
          <li
            key={project.slug}
            className="py-2 transition-opacity group-hover:opacity-60 hover:!opacity-100"
          >
            <Link
              href={`/portfolio/${project.slug}`}
              className="flex space-x-2.5"
            >
              <span className="font-medium color-level-2">{project.title}</span>
              <span className="hidden color-level-4 md:block">
                {project.summary}
              </span>
              <div className="mt-3.5 h-px min-w-4 flex-1 bg-border/80"></div>
              <span className="color-level-5">
                {format(parseContentDate(project.date), 'yyyy')}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p>
        Above are some of my featured projects. View all my projects{' '}
        <AnimatedLink href="/portfolio">here</AnimatedLink>.
      </p>

      <h2>Writing</h2>
      <ul className="group mb-7 text-[15px]">
        {featuredPosts.map((post) => (
          <li
            key={post.slug}
            className="py-2 transition-opacity group-hover:opacity-60 hover:!opacity-100"
          >
            <Link href={`/blog/${post.slug}`} className="flex space-x-2.5">
              <span className="font-medium color-level-2">{post.title}</span>
              <div className="mt-3.5 h-px min-w-4 flex-1 bg-border/80"></div>
              <span className="color-level-5">
                {format(parseContentDate(post.publishedDate), 'yyyy')}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <h2>More</h2>
      <p>
        You can view my{' '}
        <AnimatedLink href="/RyanGan_Resume.pdf" isExternal>
          resume
        </AnimatedLink>
        , read my <AnimatedLink href="/blog">blogs</AnimatedLink>, explore my
        source code on{' '}
        <AnimatedLink href="https://github.com/ryangandev" isExternal>
          GitHub
        </AnimatedLink>
        , or check out cool components from my previous work in my{' '}
        <AnimatedLink href="https://craft.ryangan.me" isExternal>
          craft collection
        </AnimatedLink>
        .
      </p>

      <h2>Connect</h2>
      <p>
        Reach me at{' '}
        <AnimatedLink href="mailto:ryangan.dev@gmail.com" isExternal>
          ryangan.dev@gmail.com
        </AnimatedLink>
        , or my contact form <AnimatedLink href="/contact">here</AnimatedLink>.
      </p>
    </main>
  );
}
