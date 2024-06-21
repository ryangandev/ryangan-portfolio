import About from '@/components/about';
import Contact from '@/components/contact';
import Experience from '@/components/experience';
import Intro from '@/components/intro';
import Projects from '@/components/projects/projects';
import Skills from '@/components/skills';

export default function Home() {
  return (
    <main className="contentContainerPadding flex flex-col items-center px-4">
      <About />
      <Skills />
      <Experience />
    </main>
  );
}
