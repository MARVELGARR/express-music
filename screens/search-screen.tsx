/**
 * SearchScreen — Full search experience.
 * Theme-aware monochrome design with search bar, filters, recent searches,
 * and real-time results from the device media library.
 */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Search,
    X,
    Music2,
    Play,
    Clock,
    Sun,
    Moon,
} from 'lucide-react-native';
import { s, vs } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MusicInfo from 'expo-music-info-2';

import { useThemeColors } from '@/features/home/hooks/useThemeColors';
import { useMediaLibrarys, MediaLibraryType } from '@/core/media-library';
import { SongInfo } from '@/core/audio-player';
import { usePlayer } from '@/features/player/hooks/usePlayer';
import useDebounce from '@/features/universal/hooks/useDebounce';
import { ScrollableTab } from '@/features/library/components/tablist';

const RECENT_SEARCHES_KEY = 'recentSearches';
const SEARCH_FILTERS = ['All', 'Songs', 'Artists', 'Albums'];

export default function SearchScreen() {
    const { colors, isDark, toggleColorScheme } = useThemeColors();
    const { songs } = useMediaLibrarys();
    const player = usePlayer();
    const inputRef = useRef<TextInput>(null);

    const [query, setQuery] = useState('');
    const { debouncedValue } = useDebounce(query, 300);
    const [filter, setFilter] = useState('All');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    // Load recent searches
    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
                if (stored) setRecentSearches(JSON.parse(stored));
            } catch (_) { }
        })();
    }, []);

    // Save search
    const saveSearch = async (term: string) => {
        if (!term.trim()) return;
        const updated = [
            term,
            ...recentSearches.filter((s) => s !== term),
        ].slice(0, 10);
        setRecentSearches(updated);
        await AsyncStorage.setItem(
            RECENT_SEARCHES_KEY,
            JSON.stringify(updated)
        );
    };

    const clearRecent = async () => {
        setRecentSearches([]);
        await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    };

    // Filter songs based on debounced query
    const results = useMemo(() => {
        if (!debouncedValue.trim()) return [];
        const q = debouncedValue.toLowerCase();
        return songs.filter((s) =>
            s.filename.toLowerCase().includes(q)
        );
    }, [debouncedValue, songs]);

    const handlePlaySong = (song: MediaLibraryType, title: string, artist: string, imageUri?: string) => {
        saveSearch(query);
        const songInfo: SongInfo = { song, title, artist, imageUri };
        const queue: SongInfo[] = songs.map((s) => ({
            song: s,
            title: s.filename.split('.')[0],
            artist: 'Unknown Artist',
        }));
        player.play(songInfo, queue);
    };

    const showRecent = !debouncedValue.trim() && recentSearches.length > 0;

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
            edges={['top']}
        >
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    Search
                </Text>
                <TouchableOpacity
                    onPress={toggleColorScheme}
                    activeOpacity={0.6}
                    style={[styles.themeBtn, { backgroundColor: colors.accentSoft }]}
                >
                    {isDark ? (
                        <Sun size={s(16)} color={colors.icon} />
                    ) : (
                        <Moon size={s(16)} color={colors.icon} />
                    )}
                </TouchableOpacity>
            </View>

            {/* Search bar */}
            <View
                style={[
                    styles.searchBar,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    },
                ]}
            >
                <Search size={s(16)} color={colors.textTertiary} />
                <TextInput
                    ref={inputRef}
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search songs, artists, albums…"
                    placeholderTextColor={colors.textTertiary}
                    style={[styles.searchInput, { color: colors.text }]}
                    autoCapitalize="none"
                    returnKeyType="search"
                    onSubmitEditing={() => saveSearch(query)}
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.6}>
                        <X size={s(16)} color={colors.textTertiary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter tabs */}
            <ScrollableTab
                tabs={SEARCH_FILTERS}
                activeTab={filter}
                onTabChange={setFilter}
            />

            {/* Recent searches */}
            {showRecent && (
                <View style={styles.recentSection}>
                    <View style={styles.recentHeader}>
                        <Text style={[styles.recentTitle, { color: colors.text }]}>
                            Recent Searches
                        </Text>
                        <TouchableOpacity onPress={clearRecent} activeOpacity={0.6}>
                            <Text style={[styles.clearText, { color: colors.textTertiary }]}>
                                Clear all
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {recentSearches.map((term, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => setQuery(term)}
                            style={[styles.recentItem, { borderBottomColor: colors.divider }]}
                            activeOpacity={0.6}
                        >
                            <Clock size={s(14)} color={colors.textTertiary} />
                            <Text style={[styles.recentText, { color: colors.textSecondary }]}>
                                {term}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Results */}
            {debouncedValue.trim().length > 0 && (
                <FlatList
                    data={results}
                    keyExtractor={(item, idx) => item.id ?? idx.toString()}
                    renderItem={({ item }) => (
                        <SearchResultRow
                            song={item}
                            onPlay={handlePlaySong}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.empty}>
                            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                                No results for "{debouncedValue}"
                            </Text>
                        </View>
                    )}
                    contentContainerStyle={styles.resultsList}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

/* ─── Search Result Row ─── */

const SearchResultRow = ({
    song,
    onPlay,
}: {
    song: MediaLibraryType;
    onPlay: (song: MediaLibraryType, title: string, artist: string, imageUri?: string) => void;
}) => {
    const { colors } = useThemeColors();
    const [info, setInfo] = useState<any>(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await MusicInfo.getMusicInfoAsync(song.uri, {
                    title: true,
                    artist: true,
                    picture: true,
                });
                setInfo(data);
            } catch (_) { }
        })();
    }, [song.uri]);

    const title = info?.title || song.filename.split('.')[0];
    const artist = info?.artist || 'Unknown Artist';
    const imageUri = info?.picture?.pictureData;

    return (
        <TouchableOpacity
            onPress={() => onPlay(song, title, artist, imageUri)}
            activeOpacity={0.7}
            style={[styles.resultRow, { borderBottomColor: colors.divider }]}
        >
            <View style={[styles.resultArtwork, { backgroundColor: colors.skeleton }]}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.resultImage} />
                ) : (
                    <Music2 size={s(18)} color={colors.textTertiary} />
                )}
            </View>
            <View style={styles.resultInfo}>
                <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={[styles.resultArtist, { color: colors.textSecondary }]} numberOfLines={1}>
                    {artist}
                </Text>
            </View>
            <Play size={s(14)} color={colors.textTertiary} fill={colors.textTertiary} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    /* Header */
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: s(16),
        paddingTop: vs(8),
        paddingBottom: vs(4),
    },
    headerTitle: {
        fontSize: s(26),
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    themeBtn: {
        width: s(34),
        height: s(34),
        borderRadius: s(10),
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* Search bar */
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: s(16),
        marginTop: vs(10),
        paddingHorizontal: s(14),
        height: vs(44),
        borderRadius: s(12),
        borderWidth: 1,
        gap: s(8),
    },
    searchInput: {
        flex: 1,
        fontSize: s(14),
        fontWeight: '500',
    },

    /* Recent */
    recentSection: {
        paddingHorizontal: s(16),
        paddingTop: vs(16),
    },
    recentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    recentTitle: {
        fontSize: s(14),
        fontWeight: '700',
    },
    clearText: {
        fontSize: s(11),
        fontWeight: '500',
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(10),
        borderBottomWidth: 1,
        gap: s(10),
    },
    recentText: {
        fontSize: s(13),
        fontWeight: '500',
    },

    /* Results */
    resultsList: {
        paddingHorizontal: s(16),
        paddingBottom: vs(140),
    },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(10),
        borderBottomWidth: 1,
    },
    resultArtwork: {
        width: s(44),
        height: s(44),
        borderRadius: s(10),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: s(12),
    },
    resultImage: {
        width: '100%',
        height: '100%',
    },
    resultInfo: {
        flex: 1,
        marginRight: s(8),
    },
    resultTitle: {
        fontSize: s(14),
        fontWeight: '600',
    },
    resultArtist: {
        fontSize: s(11),
        marginTop: vs(2),
    },
    empty: {
        paddingVertical: vs(40),
        alignItems: 'center',
    },
    emptyText: {
        fontSize: s(13),
        fontWeight: '500',
    },
});
