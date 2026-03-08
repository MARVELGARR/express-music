/**
 * useThemeColors — Central theme hook for the Express Music app.
 * Returns a flat object of color tokens that adapt to the current color scheme.
 * All components should pull colors from here so toggling is instant.
 */
import { useColorScheme } from 'nativewind';

const palette = {
    light: {
        // Surfaces
        background: '#FFFFFF',
        surface: '#F5F5F5',
        surfaceElevated: '#EBEBEB',
        card: '#F0F0F0',
        cardHover: '#E5E5E5',

        // Text
        text: '#0A0A0A',
        textSecondary: '#555555',
        textTertiary: '#8A8A8A',
        textInverted: '#FFFFFF',

        // Borders & Dividers
        border: '#E0E0E0',
        borderStrong: '#C0C0C0',
        divider: 'rgba(0,0,0,0.06)',

        // Accent — pure monochrome with a subtle cool tint
        accent: '#0A0A0A',
        accentSoft: 'rgba(10,10,10,0.08)',
        accentMuted: 'rgba(10,10,10,0.15)',

        // Player
        playerBg: '#F0F0F0',
        playerBorder: '#E0E0E0',

        // Interactive
        pillBg: '#F0F0F0',
        pillBgActive: '#0A0A0A',
        pillText: '#555555',
        pillTextActive: '#FFFFFF',

        // Skeleton/placeholder
        skeleton: '#E5E5E5',

        // Status bar
        statusBar: 'dark' as const,

        // Tab bar
        tabBarBg: '#FFFFFF',
        tabBarBorder: '#E5E5E5',
        tabActive: '#0A0A0A',
        tabInactive: '#AAAAAA',

        // Overlays
        overlay: 'rgba(0,0,0,0.4)',
        shimmer: 'rgba(255,255,255,0.5)',

        // Icon
        icon: '#0A0A0A',
        iconSecondary: '#777777',
    },
    dark: {
        // Surfaces
        background: '#0A0A0A',
        surface: '#141414',
        surfaceElevated: '#1C1C1E',
        card: '#1A1A1A',
        cardHover: '#222222',

        // Text
        text: '#FAFAFA',
        textSecondary: '#AAAAAA',
        textTertiary: '#666666',
        textInverted: '#0A0A0A',

        // Borders & Dividers
        border: '#2A2A2A',
        borderStrong: '#3A3A3A',
        divider: 'rgba(255,255,255,0.06)',

        // Accent
        accent: '#FAFAFA',
        accentSoft: 'rgba(250,250,250,0.08)',
        accentMuted: 'rgba(250,250,250,0.15)',

        // Player
        playerBg: '#1C1C1E',
        playerBorder: 'rgba(255,255,255,0.08)',

        // Interactive
        pillBg: 'rgba(255,255,255,0.06)',
        pillBgActive: '#FAFAFA',
        pillText: '#AAAAAA',
        pillTextActive: '#0A0A0A',

        // Skeleton/placeholder
        skeleton: '#1C1C1E',

        // Status bar
        statusBar: 'light' as const,

        // Tab bar
        tabBarBg: '#0A0A0A',
        tabBarBorder: '#1C1C1E',
        tabActive: '#FAFAFA',
        tabInactive: '#555555',

        // Overlays
        overlay: 'rgba(0,0,0,0.6)',
        shimmer: 'rgba(255,255,255,0.06)',

        // Icon
        icon: '#FAFAFA',
        iconSecondary: '#888888',
    },
} as const;

export type ThemeColors = (typeof palette)['dark'];

export const useThemeColors = () => {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = isDark ? palette.dark : palette.light;

    return { colors, isDark, toggleColorScheme };
};
