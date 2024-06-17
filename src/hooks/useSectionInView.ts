import { useActiveSection } from '@/hooks/useActiveSection';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import type { SectionName } from '@/models/section';

const useSectionInView = (sectionName: SectionName, threshold = 0.75) => {
    const { ref, inView } = useInView({
        threshold, // threshold means the percentage of the section that must be visible to trigger the inView callback
    });
    const { setActiveSection, timeOfLastClick } = useActiveSection();

    // To prevent intersection observer from firing on sections that are not the section clicked by the user
    useEffect(() => {
        if (inView && Date.now() - timeOfLastClick > 1000) {
            setActiveSection(sectionName);
        }
    }, [inView, sectionName, setActiveSection, timeOfLastClick]);

    return { ref, inView };
};

export { useSectionInView };
