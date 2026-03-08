/**
 * SongCard — Compact card for horizontal song carousels.
 * Shows artwork, title, artist with a play overlay.
 */
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import { Music2, Play } from 'lucide-react-native';
import MusicInfo from 'expo-music-info-2';
import { s, vs } from 'react-native-size-matters';
import { MediaLibraryType } from '@/core/media-library';
import { SongInfo } from '@/core/audio-player';
import { usePlayer } from '@/features/player/hooks/usePlayer';
import { useThemeColors } from '../hooks/useThemeColors';

type Props = {
    song: MediaLibraryType;
    allSongs: MediaLibraryType[];
    size?: 'small' | 'medium';
};

export const SongCard = ({ song, allSongs, size = 'medium' }: Props) => {
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

    const cardSize = size === 'small' ? s(100) : s(130);

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
            style={[styles.container, { width: cardSize }]}
        >
            {/* Artwork */}
            <View
                style={[
                    styles.artworkWrap,
                    {
                        width: cardSize,
                        height: cardSize,
                        backgroundColor: colors.skeleton,
                        borderRadius: s(14),
                    },
                ]}
            >
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={[styles.artwork, { borderRadius: s(14) }]}
                    />
                ) : (
                    <View style={styles.placeholderIcon}>
                        <Music2 size={s(28)} color={colors.textTertiary} />
                    </View>
                )}
                {/* Play overlay */}
                <View
                    style={[
                        styles.playOverlay,
                        { backgroundColor: colors.overlay },
                    ]}
                >
                    <Play size={s(14)} color="#FFFFFF" fill="#FFFFFF" />
                </View>
            </View>

            {/* Text */}
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
    container: {
        marginRight: s(14),
    },
    artworkWrap: {
        overflow: 'hidden',
        position: 'relative',
    },
    artwork: {
        width: '100%',
        height: '100%',
    },
    placeholderIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playOverlay: {
        position: 'absolute',
        bottom: s(8),
        right: s(8),
        padding: s(6),
        borderRadius: s(20),
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
