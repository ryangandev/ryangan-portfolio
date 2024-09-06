import { cn } from '@/lib/utils';

export default function SectionHeader({
  section,
  classname,
}: {
  section: string;
  classname?: string;
}) {
  return (
    <h2
      className={cn(
        'mb-8 text-nowrap text-3xl font-bold capitalize md:text-4xl',
        'shadow-font',
        classname,
      )}
    >
      {section}
    </h2>
  );
}
