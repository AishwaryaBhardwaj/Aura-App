import { TextStyle } from 'react-native';

export const theme = {
    colors: {
        backgroundTop: '#E65C7B', // Deep Magenta Pink
        backgroundBottom: '#FDECF0', // Soft Pastel Pink/Cream
        primary: '#E65C7B', // Deep Magenta Pink for primary actions
        accent: '#FADADD', // Very Light Pastel Pink
        accentGold: '#FFB6C1', // Soft Rose Gold/Pink
        text: '#4A4A4A', // Softer Deep Slate/Charcoal
        card: '#FFFFFF', // Clean White cards
        border: '#F0E6EA', // Very soft grey/pink borders
        error: '#E65C7B', // Primary Magenta
    },
    typography: {
        script: {
            fontFamily: 'System', // Reverting to clean sans-serif
            fontSize: 32,
            fontWeight: '600' as TextStyle['fontWeight'],
            color: '#4A4A4A',
        },
        header: {
            fontFamily: 'System',
            fontSize: 32,
            fontWeight: '700' as TextStyle['fontWeight'],
            color: '#4A4A4A',
        },
        title: {
            fontFamily: 'System',
            fontSize: 24,
            fontWeight: '600' as TextStyle['fontWeight'],
            color: '#4A4A4A',
        },
        body: {
            fontFamily: 'System',
            fontSize: 18,
            fontWeight: '400' as TextStyle['fontWeight'],
            color: '#4A4A4A',
        },
        caption: {
            fontFamily: 'System',
            fontSize: 14,
            fontWeight: 'normal' as TextStyle['fontWeight'],
            color: '#8A8A8A', // Softer grey for captions
        },
    },
    spacing: {
        none: 0,
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 40,
    },
    borderRadius: {
        sm: 8,
        md: 16,
        lg: 24,
        xl: 30, // Keeping pill-shaped buttons
        round: 9999,
    },
    shadows: {
        // Soft, dreamy shadows for Pastel aesthetic
        cloud: {
            shadowColor: '#E65C7B',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 8,
        },
        bubble: {
            shadowColor: '#E65C7B',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 4,
        }
    }
};

export type Theme = typeof theme;
