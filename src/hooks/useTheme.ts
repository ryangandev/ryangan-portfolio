import { useContext } from 'react';
import { ThemeContext } from '@/providers/theme-provider';

const useTheme = () => {
    const context = useContext(ThemeContext);

    if (context === null) {
        throw new Error('useTheme must be used within a ThemeContextProvider');
    }

    return context;
};

export { useTheme };
