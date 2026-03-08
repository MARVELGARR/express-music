/**
 * RecentlyPlayed — Horizontal carousel of recently played songs on the home screen.
 * Theme-aware monochrome design.
 */
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import { Music2, Play } from 'lucide-react-native';
import MusicInfo from 'expo-music-info-2';
import { s, vs } from 'react-native-size-matters';
import { Link } from 'expo-router';

import { MediaLibraryType, useMediaLibrarys } from '@/core/media-library';
import { SongInfo } from '@/core/audio-player';
import { usePlayer } from '@/features/player/hooks/usePlayer';
import { useThemeColors } from '@/features/home/hooks/useThemeColors';

export const RecentlyPlayed = () => {
    const { songs } = useMediaLibrarys();
    const { colors } = useThemeColors();

    // Show only the first 10 songs as "recently played"
    const recentSongs = songs.slice(0, 10);

    if (recentSongs.length === 0) return null;

    return (
        <View>
            {/* Section header */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Recently Played
                </Text>
                <Link href="/(app)/recentlyplayed" asChild>
                    <TouchableOpacity activeOpacity={0.6}>
                        <Text style={[styles.seeAll, { color: colors.textTertiary }]}>
                            See all
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* Horizontal scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {recentSongs.map((song, idx) => (
                    <RecentItem
                        key={idx}
                        song={song}
                        allSongs={songs}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

/* ─── Individual item ─── */

const RecentItem = ({
    song,
    allSongs,
}: {
    song: MediaLibraryType;
    allSongs: MediaLibraryType[];
}) => {
    const { colors } = useThemeColors();
    const player = usePlayer();
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

    const handlePlay = () => {
        const songInfo: SongInfo = { song, title, artist, imageUri };
        const queue: SongInfo[] = allSongs.map((s) => ({
            song: s,
            title: s.filename.split('.')[0],
            artist: 'Unknown Artist',
        }));
        player.play(songInfo, queue);
    };

    return (
        <TouchableOpacity
            onPress={handlePlay}
            activeOpacity={0.7}
            style={styles.itemContainer}
        >
            {/* Artwork */}
            <View
                style={[
                    styles.artworkWrap,
                    { backgroundColor: colors.skeleton },
                ]}
            >
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.artwork} />
                ) : (
                    <View style={styles.placeholder}>
                        <Music2 size={s(26)} color={colors.textTertiary} />
                    </View>
                )}
                {/* Play badge */}
                <View
                    style={[styles.playBadge, { backgroundColor: colors.overlay }]}
                >
                    <Play size={s(12)} color="#FFFFFF" fill="#FFFFFF" />
                </View>
            </View>

            <Text
                style={[styles.title, { color: colors.text }]}
                numberOfLines={1}
            >
                {title}
            </Text>
            <Text
                style={[styles.artist, { color: colors.textSecondary }]}
                numberOfLines={1}
            >
                {artist}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: s(16),
        marginBottom: vs(10),
        marginTop: vs(20),
    },
    sectionTitle: {
        fontSize: s(17),
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    seeAll: {
        fontSize: s(12),
        fontWeight: '500',
    },
    scrollContent: {
        paddingHorizontal: s(16),
    },
    itemContainer: {
        width: s(120),
        marginRight: s(14),
    },
    artworkWrap: {
        width: s(120),
        height: s(120),
        borderRadius: s(14),
        overflow: 'hidden',
        position: 'relative',
    },
    artwork: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playBadge: {
        position: 'absolute',
        bottom: s(8),
        right: s(8),
        padding: s(6),
        borderRadius: s(16),
    },
    title: {
        marginTop: vs(6),
        fontSize: s(12),
        fontWeight: '600',
    },
    artist: {
        fontSize: s(10),
        marginTop: vs(1),
    },
});
