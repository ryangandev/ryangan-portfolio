import { techStack, TechStackIconName } from '@/data/tech-stack';
import { cn } from '@/lib/utils';

type TechStackIconProps = {
  name: TechStackIconName;
  /** Defaults to 24 */
  size?: number;
  className?: string;
  /**
   * Accessible name, also shown as a tooltip. Leave it out when a visible
   * label sits next to the icon, and the icon is hidden from assistive tech.
   */
  title?: string;
};

const TechStackIcon = ({
  name,
  size = 24,
  className,
  title,
}: TechStackIconProps) => {
  const { icon: Icon, className: brandClassName } = techStack[name];

  return (
    <Icon
      size={size}
      className={cn(brandClassName, className)}
      title={title}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    />
  );
};

export default TechStackIcon;
