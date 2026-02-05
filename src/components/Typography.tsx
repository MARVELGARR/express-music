import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { normalize } from '../theme';
import { colors } from '../theme/colors';

interface TypographyProps extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';
    color?: string;
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body',
    color = colors.text,
    style,
    ...props
}) => {
    return (
        <Text style={[styles[variant], { color }, style]} {...props}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    h1: {
        fontSize: normalize(28),
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    h2: {
        fontSize: normalize(22),
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    h3: {
        fontSize: normalize(18),
        fontWeight: '600',
    },
    body: {
        fontSize: normalize(16),
        fontWeight: '400',
        lineHeight: normalize(24),
    },
    caption: {
        fontSize: normalize(12),
        fontWeight: '400',
        color: colors.textSecondary,
    },
    button: {
        fontSize: normalize(16),
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});
