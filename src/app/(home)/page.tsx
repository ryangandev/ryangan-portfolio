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
      <p className="color-level-4 mt-16">
        Site rework is still under development. I am actively trying to fill it
        out with more content.
      </p>
    </main>
  );
}
