import { cn } from '@/libs/utils';

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
        'mb-8 text-nowrap text-3xl font-bold capitalize',
        'shadow-font',
        classname,
      )}
    >
      {section}
    </h2>
  );
}
