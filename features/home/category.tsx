/**
 * CategoryFilter — Horizontally scrollable filter chips.
 * Modern monochrome design with animated selection state.
 */
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useThemeColors } from './hooks/useThemeColors';
import { s, vs } from 'react-native-size-matters';
// import { s, vs } from 'react-native-size-matters';
// import { useThemeColors } from '../hooks/useThemeColors';

type Props = {
    categories: readonly { readonly name: string }[];
    selected: string;
    onSelect: (name: string) => void;
};

export const CategoryFilter = ({ categories, selected, onSelect }: Props) => {
    const { colors } = useThemeColors();

    return (
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >


            {categories.map((cat, idx) => {
                const isActive = selected === cat.name;
                return (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => onSelect(cat.name)}
                        activeOpacity={0.7}
                        style={[
                            styles.pill,
                            {
                                backgroundColor: isActive
                                    ? colors.pillBgActive
                                    : colors.pillBg,
                                borderColor: isActive
                                    ? colors.pillBgActive
                                    : colors.border,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.pillText,
                                {
                                    color: isActive
                                        ? colors.pillTextActive
                                        : colors.pillText,
                                },
                            ]}
                        >
                            {cat.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: s(16),
        paddingVertical: vs(8),
        gap: s(8),
    },
    pill: {
        paddingHorizontal: s(16),
        paddingVertical: vs(7),
        borderRadius: s(20),
        borderWidth: 1,
    },
    pillText: {
        fontSize: s(12),
        fontWeight: '600',
        letterSpacing: 0.3,
    },
});
