import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface GlassViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
}

export const GlassView: React.FC<GlassViewProps> = ({ children, style, intensity = 50 }) => {
    return (
        <View style={[styles.container, style]}>
            <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.glass.background,
        borderColor: colors.glass.border,
        borderWidth: 1,
        overflow: 'hidden',
    },
    content: {
        zIndex: 1,
    },
});
