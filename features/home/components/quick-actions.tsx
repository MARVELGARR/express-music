/**
 * QuickActions — 2×2 grid of action cards on home screen.
 * Futuristic glass-morphism style with monochrome palette.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Shuffle, Clock, Heart, BarChart2 } from 'lucide-react-native';
import { s, vs } from 'react-native-size-matters';
import { useThemeColors } from '../hooks/useThemeColors';

const iconMap: Record<string, React.ElementType> = {
    shuffle: Shuffle,
    clock: Clock,
    heart: Heart,
    'bar-chart-2': BarChart2,
};

type QuickAction = { id: string; label: string; icon: string };
type Props = {
    actions: readonly QuickAction[];
    onPress: (id: string) => void;
};

export const QuickActions = ({ actions, onPress }: Props) => {
    const { colors } = useThemeColors();

    return (
        <View style={styles.grid}>
            {actions.map((action) => {
                const Icon = iconMap[action.icon] || Shuffle;
                return (
                    <TouchableOpacity
                        key={action.id}
                        activeOpacity={0.7}
                        onPress={() => onPress(action.id)}
                        style={[
                            styles.card,
                            {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: colors.accentSoft },
                            ]}
                        >
                            <Icon size={s(18)} color={colors.text} />
                        </View>
                        <Text
                            style={[styles.label, { color: colors.text }]}
                            numberOfLines={1}
                        >
                            {action.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: s(16),
        gap: s(10),
    },
    card: {
        width: '47%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(12),
        paddingHorizontal: s(12),
        borderRadius: s(12),
        borderWidth: 1,
        gap: s(10),
    },
    iconContainer: {
        width: s(36),
        height: s(36),
        borderRadius: s(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: s(12),
        fontWeight: '600',
        flexShrink: 1,
    },
});
