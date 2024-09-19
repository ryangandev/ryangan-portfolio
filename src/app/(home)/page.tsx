import { newsreader } from '@/assets/fonts';
import AnimatedLink from '@/components/animated-link';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <main>
      <h1>Ryan (Zhiheng) Gan</h1>

      <h2>Greeting</h2>
      <p
        className={cn(newsreader.className, 'text-[17.5px] font-medium italic')}
      >
        I am a user before a developer.
      </p>
      <p>
        I like to craft polished, user-centric software that brings satisfaction
        through every little detail.
      </p>
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
          Git, Docker, Unity, Agile, AWS, Vercel
        </li>
      </ul>
      <p>
        I embrace continuous learning and am constantly picking up new skills.
        Currently, I&apos;m exploring GraphQL.
      </p>

      <h2>My Work</h2>
      <p>
        View all my projects <AnimatedLink href="/portfolio">here</AnimatedLink>
        .
      </p>

      <h2>Let&apos;s Connect</h2>
      <p>
        Reach me via email at{' '}
        <AnimatedLink href="mailto:ryangan.dev@gmail.com" isExternal>
          ryangan.dev@gmail.com
        </AnimatedLink>
        , or my contact form <AnimatedLink href="/contact">here</AnimatedLink>.
      </p>

      <h2>More</h2>
      <p>
        You can view my{' '}
        <AnimatedLink href="/RyanG_resume.pdf" isExternal>
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

      <p className="color-level-5 mt-16">
        Site rework is still under development. I am actively trying to fill it
        out with more content. In the meantime, you can check out my previous
        site{' '}
        <AnimatedLink href="https://old.ryangan.me" isExternal>
          here
        </AnimatedLink>{' '}
        if you&apos;d like.
      </p>
    </main>
  );
}
