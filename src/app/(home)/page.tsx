import { format } from 'date-fns';
import Link from 'next/link';

import { newsreader } from '@/assets/fonts';
import AnimatedLink from '@/components/animated-link';
import { getFeaturedProjects } from '@/lib/content';
import { cn } from '@/lib/utils';

export default async function Home() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <main>
      <h1>Ryan (Zhiheng) Gan</h1>

      <h3 className={cn(newsreader.className, 'mb-7 text-[17.5px] italic')}>
        I am a user before a developer.
      </h3>
      <p>
        I like to craft polished, user-centric software that brings satisfaction
        through every little detail.
      </p>

      <h2>About Me</h2>
      <p className="mb-4">
        As a software engineer specializing in full-stack development with 2
        years of experience, my tech stack includes:
      </p>
      <ul className="mb-7 list-inside list-disc space-y-2">
        <li>
          <span className="color-level-2 font-medium">Frontend</span>: React,
          Next.js, TypeScript, Figma
        </li>
        <li>
          <span className="color-level-2 font-medium">Backend</span>: Node.js,
          SpringBoot, Java, PostgreSQL, MongoDB, Prisma
        </li>
        <li>
          <span className="color-level-2 font-medium">Tools & Others</span>:
          Git, Docker, Postman, Agile, AWS, Vercel
        </li>
      </ul>
      <p>
        I embrace continuous learning and am constantly picking up new skills.
        Currently, I&apos;m exploring GraphQL.
      </p>

      <h2>Featured Portfolio</h2>
      <ul className="group mb-7 text-[15px]">
        {featuredProjects.map((project) => (
          <li
            key={project.slug}
            className="py-2 transition-opacity hover:!opacity-100 group-hover:opacity-60"
          >
            <Link
              href={`/portfolio/${project.slug}`}
              className="flex space-x-2.5"
            >
              <span className="color-level-2 font-medium">{project.title}</span>
              <span className="color-level-4 hidden md:block">
                {project.summary}
              </span>
              <div className="my-auto h-px flex-1 bg-border/80"></div>
              <span className="color-level-5">
                {format(new Date(project.date), 'yyyy')}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="color-level-4">
        These are some of my featured projects. View all my projects{' '}
        <AnimatedLink href="/portfolio">here</AnimatedLink>.
      </p>

      <h2>More</h2>
      <p>
        You can view my{' '}
        <AnimatedLink href="/RyanG_resume.pdf" isExternal>
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
