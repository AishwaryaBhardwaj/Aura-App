import { TextStyle } from 'react-native';

export const theme = {
    colors: {
        primary: '#6D7C98', // Soft steel blue
        secondary: '#B4BFE0', // Soft lilac/blue
        background: '#F9FAFB', // Light off-white for calming background
        card: '#FFFFFF', // Clean white
        text: '#2D3748', // Soft dark gray for text
        border: '#E2E8F0', // Subtle light gray border
        accent: '#82C1A6', // Sage green accent
        error: '#E57373', // Soft red
    },
    typography: {
        header: {
            fontSize: 24,
            fontWeight: 'bold' as TextStyle['fontWeight'],
        },
        title: {
            fontSize: 20,
            fontWeight: '600' as TextStyle['fontWeight'],
        },
        body: {
            fontSize: 16,
            fontWeight: 'normal' as TextStyle['fontWeight'],
        },
        caption: {
            fontSize: 12,
            fontWeight: 'normal' as TextStyle['fontWeight'],
            color: '#A0AEC0',
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
        sm: 4,
        md: 8,
        lg: 16,
        xl: 24,
        round: 9999,
    }
};

export type Theme = typeof theme;
