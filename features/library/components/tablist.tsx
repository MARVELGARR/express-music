/**
 * ScrollableTab — Horizontal pill-style tab bar.
 * Active/inactive states use monochrome theme tokens.
 */
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { useThemeColors } from '@/features/home/hooks/useThemeColors';

export type ScrollableTabProp = {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
};

export const ScrollableTab = ({ tabs, activeTab, onTabChange }: ScrollableTabProp) => {
    const { colors } = useThemeColors();

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => onTabChange(tab)}
                            activeOpacity={0.7}
                            style={[
                                styles.tab,
                                {
                                    backgroundColor: isActive
                                        ? colors.pillBgActive
                                        : 'transparent',
                                    borderColor: isActive
                                        ? colors.pillBgActive
                                        : colors.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    {
                                        color: isActive
                                            ? colors.pillTextActive
                                            : colors.pillText,
                                    },
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: vs(6),
    },
    scrollContent: {
        paddingHorizontal: s(16),
        gap: s(8),
    },
    tab: {
        paddingHorizontal: s(18),
        paddingVertical: vs(7),
        borderRadius: s(20),
        borderWidth: 1,
    },
    tabText: {
        fontSize: s(12),
        fontWeight: '600',
        letterSpacing: 0.2,
    },
});