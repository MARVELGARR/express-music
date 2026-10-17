/**
 * HomeScreen — Main landing screen.
 *
 * Layout (top → bottom), kept deliberately airy:
 *   - Header: greeting + library count, search & theme toggle
 *   - Library hero: single card with Play all / Shuffle
 *   - Tabs: For You / Songs / Albums / Artists
 *   - Content for the active tab
 */
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vs } from 'react-native-size-matters';

import { useThemeColors } from '@/features/home/hooks/useThemeColors';
import { ScrollableTab } from '@/features/library/components/tablist';
import LibraryHero from '@/features/home/components/library-hero';
import HomeHeader from '@/features/home/components/home-header';
import ActiveTabs from '@/features/home/components/active-tabs';

const TABS = ['For You', 'Songs', 'Albums', 'Artists'];

const HomeScreen = () => {
    const { colors, isDark } = useThemeColors();
    const [activeTab, setActiveTab] = useState('For You');

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
            edges={['top']}
        >
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ─── Header ─── */}
                <HomeHeader />

                {/* ─── Hero: library size + play/shuffle ─── */}
                <LibraryHero />

                {/* ─── Tabs ─── */}
                <View style={styles.tabsWrap}>
                    <ScrollableTab
                        tabs={TABS}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </View>

                {/* ─── Content based on active tab ─── */}
                <ActiveTabs activeTab={activeTab} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: vs(160),
    },
    tabsWrap: {
        marginTop: vs(20),
    },
});
