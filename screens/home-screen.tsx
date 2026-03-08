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
import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Sun, Moon, Music } from 'lucide-react-native';
import { s, vs } from 'react-native-size-matters';
import { useRouter } from 'expo-router';

import { useThemeColors } from '@/features/home/hooks/useThemeColors';
import { categoryTags, quickActions } from '@/features/home/constants';
import { CategoryFilter } from '@/features/home/category';
import { QuickActions } from '@/features/home/components/quick-actions';
import { RecentlyPlayed } from '@/features/library/components/recently-played';
import { AllSongs } from '@/features/library/components/all_songs';
import { ScrollableTab } from '@/features/library/components/tablist';
import { useMediaLibrarys } from '@/core/media-library';
import { usePlayer } from '@/features/player/hooks/usePlayer';

const TABS = ['For You', 'Songs', 'Albums', 'Artists'];

const HomeScreen = () => {
    const { colors, isDark, toggleColorScheme } = useThemeColors();
    const router = useRouter();
    const { songs, totalCount } = useMediaLibrarys();
    const player = usePlayer();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeTab, setActiveTab] = useState('For You');

    // Greeting based on time of day
    const greeting = useMemo(() => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 18) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

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
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View
                            style={[
                                styles.logoCircle,
                                { backgroundColor: colors.accent },
                            ]}
                        >
                            <Music size={s(14)} color={colors.textInverted} />
                        </View>
                        <View>
                            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                                {greeting}
                            </Text>
                            <Text style={[styles.appName, { color: colors.text }]}>
                                Express Music
                            </Text>
                        </View>
                    </View>

                    <View style={styles.headerRight}>
                        {/* Search */}
                        <TouchableOpacity
                            onPress={() => router.push('/search')}
                            activeOpacity={0.6}
                            style={[
                                styles.iconBtn,
                                { backgroundColor: colors.accentSoft },
                            ]}
                        >
                            <Search size={s(18)} color={colors.icon} />
                        </TouchableOpacity>

                        {/* Dark / Light toggle — easy to reach */}
                        <TouchableOpacity
                            onPress={toggleColorScheme}
                            activeOpacity={0.6}
                            style={[
                                styles.iconBtn,
                                { backgroundColor: colors.accentSoft },
                            ]}
                        >
                            {isDark ? (
                                <Sun size={s(18)} color={colors.icon} />
                            ) : (
                                <Moon size={s(18)} color={colors.icon} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ─── Stats bar ─── */}
                <View style={[styles.statsBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.stat}>
                        <Text style={[styles.statNumber, { color: colors.text }]}>{totalCount}</Text>
                        <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Songs</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
                    <View style={styles.stat}>
                        <Text style={[styles.statNumber, { color: colors.text }]}>{player.queue.length}</Text>
                        <Text style={[styles.statLabel, { color: colors.textTertiary }]}>In Queue</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
                    <View style={styles.stat}>
                        <Text style={[styles.statNumber, { color: colors.text }]}>
                            {player.shuffled ? 'ON' : 'OFF'}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Shuffle</Text>
                    </View>
                </View>

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
                {activeTab === 'For You' && (
                    <>
                        {/* Recently Played */}
                        <RecentlyPlayed />

                        {/* Category filters */}
                        <View style={styles.sectionSpacing}>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    { color: colors.text },
                                ]}
                            >
                                Browse
                            </Text>
                            <CategoryFilter
                                categories={categoryTags}
                                selected={selectedCategory}
                                onSelect={setSelectedCategory}
                            />
                        </View>

                        {/* Songs list preview */}
                        <View style={styles.sectionSpacing}>
                            <View style={styles.sectionHeaderRow}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                    All Songs
                                </Text>
                                <Text style={[styles.countBadge, { color: colors.textTertiary }]}>
                                    {totalCount} tracks
                                </Text>
                            </View>
                        </View>
                        <AllSongs maxItems={15} />
                    </>
                )}

                {activeTab === 'Songs' && (
                    <View>
                        <View style={[styles.sectionSpacing, styles.sectionHeaderRow]}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                All Songs
                            </Text>
                            <Text style={[styles.countBadge, { color: colors.textTertiary }]}>
                                {totalCount} tracks
                            </Text>
                        </View>
                        <AllSongs />
                    </View>
                )}

                {activeTab === 'Albums' && (
                    <View style={styles.comingSoon}>
                        <Text style={[styles.comingSoonText, { color: colors.textTertiary }]}>
                            Albums — Coming Soon
                        </Text>
                    </View>
                )}

                {activeTab === 'Artists' && (
                    <View style={styles.comingSoon}>
                        <Text style={[styles.comingSoonText, { color: colors.textTertiary }]}>
                            Artists — Coming Soon
                        </Text>
                    </View>
                )}
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

    /* Header */
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: s(16),
        paddingVertical: vs(12),
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(10),
    },
    logoCircle: {
        width: s(36),
        height: s(36),
        borderRadius: s(18),
        justifyContent: 'center',
        alignItems: 'center',
    },
    greeting: {
        fontSize: s(11),
        fontWeight: '500',
    },
    appName: {
        fontSize: s(18),
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(8),
    },
    iconBtn: {
        width: s(38),
        height: s(38),
        borderRadius: s(12),
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* Stats bar */
    statsBar: {
        flexDirection: 'row',
        marginHorizontal: s(16),
        marginTop: vs(4),
        paddingVertical: vs(12),
        paddingHorizontal: s(16),
        borderRadius: s(14),
        borderWidth: 1,
        alignItems: 'center',
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: s(16),
        fontWeight: '800',
    },
    statLabel: {
        fontSize: s(10),
        fontWeight: '500',
        marginTop: vs(2),
    },
    statDivider: {
        width: 1,
        height: vs(24),
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