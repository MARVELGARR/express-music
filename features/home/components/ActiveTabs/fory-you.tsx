/**
 * ForYouCategory — Landing tab content.
 * Recently Played rail, compact Browse shortcuts, then All Songs preview.
 */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { s, vs } from 'react-native-size-matters'
import { BarChart2, ChevronLeft, Folder, Heart } from 'lucide-react-native'
import { useThemeColors } from '../../hooks/useThemeColors';
import { RecentlyPlayed } from '@/features/library/components/recently-played';
import { useMediaLibrarys } from '@/core/media-library';
import MostPlayed from './Foryou-Componets/most-played';
import Favourites from './Foryou-Componets/favourites';
import Albums from './Foryou-Componets/albums';
import Artists from './Foryou-Componets/artists';
import Folders from './Foryou-Componets/folders';
import AllSongs from './Foryou-Componets/all_songs';

const BROWSE_SHORTCUTS = [
    { name: 'Most Played', icon: BarChart2 },
    { name: 'Favourites', icon: Heart },
    { name: 'Folders', icon: Folder },
] as const;

export const ForYouCategory = () => {
    const { colors } = useThemeColors();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { totalCount } = useMediaLibrarys();

    if (selectedCategory !== 'All') {
        return (
            <View>
                <View style={styles.sectionSpacing}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setSelectedCategory('All')}
                        style={styles.backRow}
                    >
                        <ChevronLeft size={s(16)} color={colors.textSecondary} />
                        <Text style={[styles.backText, { color: colors.textSecondary }]}>
                            Browse
                        </Text>
                    </TouchableOpacity>
                    <View style={[styles.sectionHeaderRow, styles.titleSpacing]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {selectedCategory}
                        </Text>
                    </View>
                </View>
                <CategoryContent category={selectedCategory} />
            </View>
        );
    }

    return (
        <View>
            {/* ─── Recently Played ─── */}
            <RecentlyPlayed />

            {/* ─── Browse shortcuts ─── */}
            <View style={styles.sectionSpacing}>
                <View style={styles.sectionHeaderRow}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Browse
                    </Text>
                </View>
                <View style={styles.shortcutRow}>
                    {BROWSE_SHORTCUTS.map(({ name, icon: Icon }) => (
                        <TouchableOpacity
                            key={name}
                            activeOpacity={0.7}
                            onPress={() => setSelectedCategory(name)}
                            style={[
                                styles.shortcut,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.shortcutIcon,
                                    { backgroundColor: colors.accentSoft },
                                ]}
                            >
                                <Icon size={s(18)} color={colors.text} />
                            </View>
                            <Text
                                style={[styles.shortcutLabel, { color: colors.text }]}
                                numberOfLines={1}
                            >
                                {name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* ─── All Songs preview ─── */}
            <View style={[styles.sectionSpacing, styles.sectionHeaderRow]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    All Songs
                </Text>
                <Text style={[styles.countBadge, { color: colors.textTertiary }]}>
                    {totalCount} tracks
                </Text>
            </View>
            <AllSongs maxItems={15} />
        </View>
    );
};

const CategoryContent = ({ category }: { category: string }) => {
    switch (category) {
        case 'Most Played':
            return <MostPlayed />
        case 'Favourites':
            return <Favourites />
        case 'Albums':
            return <Albums />
        case 'Artists':
            return <Artists />
        case 'Folders':
            return <Folders />
        default:
            return null
    }
}

const styles = StyleSheet.create({
    sectionSpacing: {
        marginTop: vs(24),
    },
    sectionTitle: {
        fontSize: s(17),
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: s(16),
    },
    titleSpacing: {
        marginTop: vs(6),
    },
    countBadge: {
        fontSize: s(11),
        fontWeight: '500',
    },
    backRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: s(16),
    },
    backText: {
        fontSize: s(12),
        fontWeight: '600',
        marginLeft: s(2),
    },
    shortcutRow: {
        flexDirection: 'row',
        gap: s(10),
        paddingHorizontal: s(16),
        marginTop: vs(12),
    },
    shortcut: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: vs(14),
        borderRadius: s(14),
        borderWidth: 1,
        gap: vs(8),
    },
    shortcutIcon: {
        width: s(36),
        height: s(36),
        borderRadius: s(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    shortcutLabel: {
        fontSize: s(11),
        fontWeight: '600',
    },
});
