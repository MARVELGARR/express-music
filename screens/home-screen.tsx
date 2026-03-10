/**
 * HomeScreen — Main landing screen.
 *
 * Design: Monochrome black & white, digitalized modern aesthetic.
 * Features:
 *   - Greeting header with dark/light toggle (top-right, easy to reach)
 *   - Quick action cards (Shuffle, Recent, Favourites, Most Played)
 *   - Category filter pills
 *   - Recently Played carousel
 *   - All Songs list with filter support
 */
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { useRouter } from 'expo-router';

import { useThemeColors } from '@/features/home/hooks/useThemeColors';
import { categoryTags, quickActions } from '@/features/home/constants';
import { QuickActions } from '@/features/home/components/quick-actions';
import { ScrollableTab } from '@/features/library/components/tablist';
import { useMediaLibrarys } from '@/core/media-library';
import { usePlayer } from '@/features/player/hooks/usePlayer';

import StatsBar from '@/features/home/components/stats-bar';
import HomeHeader from '@/features/home/components/home-header';
import ActiveTabs from '@/features/home/components/active-tabs';

const TABS = ['For You', 'Songs', 'Albums', 'Artists'];

const HomeScreen = () => {
    const { colors, isDark, } = useThemeColors();
    const router = useRouter();
    const { songs, totalCount } = useMediaLibrarys();
    const player = usePlayer();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeTab, setActiveTab] = useState('For You');


    // Handle quick actions
    const handleQuickAction = (id: string) => {
        switch (id) {
            case 'shuffle':
                if (songs.length > 0) {
                    const randomIdx = Math.floor(Math.random() * songs.length);
                    const randomSong = songs[randomIdx];
                    const queue = songs.map((s) => ({
                        song: s,
                        title: s.filename.split('.')[0],
                        artist: 'Unknown Artist',
                    }));
                    player.play(queue[randomIdx], queue);
                    if (!player.shuffled) player.toggleShuffle();
                }
                break;
            case 'recent':
                router.push('/(app)/recentlyplayed');
                break;
            default:
                break;
        }
    };

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
                {/* ─── Stats bar ─── */}
                <StatsBar />

                {/* ─── Quick Actions ─── */}
                <View style={styles.sectionSpacing}>
                    <QuickActions
                        actions={quickActions}
                        onPress={handleQuickAction}
                    />
                </View>

                {/* ─── Tabs ─── */}
                <View style={styles.sectionSpacing}>
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


    /* Sections */
    sectionSpacing: {
        marginTop: vs(16),
    },
    sectionTitle: {
        fontSize: s(17),
        fontWeight: '700',
        letterSpacing: -0.3,
        paddingHorizontal: s(16),
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: s(16),
    },
    countBadge: {
        fontSize: s(11),
        fontWeight: '500',
    },

    /* Placeholder for coming soon */
    comingSoon: {
        paddingVertical: vs(60),
        alignItems: 'center',
    },
    comingSoonText: {
        fontSize: s(14),
        fontWeight: '600',
    },
});