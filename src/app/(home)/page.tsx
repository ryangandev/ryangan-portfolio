import About from '@/components/about';
import Intro from '@/components/intro';
import Skills from '@/components/skills';

export default function Home() {
  return (
    <main className="contentContainerPadding flex flex-col items-center px-4">
      <Intro />
      <About />
      <Skills />
    </main>
  );
}
