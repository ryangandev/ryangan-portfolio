import AnimatedLink from '@/components/animated-link';
import Intro from '@/components/intro';

export default function Home() {
  return (
    <main className="">
      <Intro />

      <p className="color-level-2">
        View my projects <AnimatedLink href="/portfolio">here</AnimatedLink>
      </p>
      <p className="color-level-2">
        View my crafts{' '}
        <AnimatedLink href="https://craft.ryangan.me" isExternal>
          here
        </AnimatedLink>
      </p>

      <section id="contact" className="mt-16">
        <p className="color-level-2 mb-7 font-medium">Connect</p>
        <p className="color-level-3">
          Reach me at{' '}
          <AnimatedLink href="mailto:ryangan.dev@gmail.com" isExternal>
            ryangan.dev@gmail.com
          </AnimatedLink>
          , or use the contact form{' '}
          <AnimatedLink href="/contact">here</AnimatedLink> .
        </p>
      </section>

      <p className="color-level-5 mt-16">
        Site rework is still under development. I am actively trying to fill it
        out with more content. In the meantime, you can checkout my previous
        site{' '}
        <AnimatedLink href="https://old.ryangan.me" isExternal>
          here
        </AnimatedLink>{' '}
        if you&apos; like.
      </p>
    </main>
  );
}
