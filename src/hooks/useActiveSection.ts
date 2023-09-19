import { ActiveSectionContext } from '@/providers/active-section-context';
import { useContext } from 'react';

const useActiveSection = () => {
    const context = useContext(ActiveSectionContext);

    if (context === null) {
        throw new Error(
            'useActiveSectionContext must be used within a ActiveSectionContextProvider',
        );
    }

    return context;
};

export { useActiveSection };
