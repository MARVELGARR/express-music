/**
 * SongRow — Single row item for vertical song lists.
 * Shows index, artwork, metadata, and a play button.
 */
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import { Music2, Play, Pause, MoreVertical } from 'lucide-react-native';
import { s, vs } from 'react-native-size-matters';
import { MediaLibraryType } from '@/core/media-library';
import { SongInfo } from '@/core/audio-player';
import { getMusicMetadata } from '@/core/music-metadata';
import {
    usePlayerState,
    usePlayerControls,
} from '@/features/player/hooks/usePlayer';
import { useThemeColors } from '../../home/hooks/useThemeColors';

type Props = {
    song: MediaLibraryType;
    allSongs: MediaLibraryType[];
    index: number;
    showIndex?: boolean;
};

export const SongRow = ({ song, allSongs, index, showIndex = false }: Props) => {
    const { colors } = useThemeColors();
    const { currentSong, isPlaying } = usePlayerState();
    const { play } = usePlayerControls();
    const [info, setInfo] = useState<any>(null);

    const isCurrent = currentSong?.song.uri === song.uri;

    useEffect(() => {
        let active = true;
        getMusicMetadata(song.uri).then((meta) => {
            if (active) setInfo(meta);
        });
        return () => {
            active = false;
        };
    }, [song.uri]);

    const title = info?.title || song.filename.split('.')[0];
    const artist = info?.artist || 'Unknown Artist';
    const imageUri = info?.picture?.pictureData;

    // Format duration
    const durationSec = Math.round(song.duration);
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    const duration = `${mins}:${secs.toString().padStart(2, '0')}`;

    const handlePlay = () => {
        const songInfo: SongInfo = { song, title, artist, imageUri };
        const queue: SongInfo[] = allSongs.map((s) => ({
            song: s,
            title: s.filename.split('.')[0],
            artist: 'Unknown Artist',
        }));
        play(songInfo, queue);
    };

    return (
        <TouchableOpacity
            onPress={handlePlay}
            activeOpacity={0.7}
            style={[styles.row, { borderBottomColor: colors.divider }]}
        >
            {/* Index or playing indicator */}
            {showIndex && (
                <Text
                    style={[
                        styles.index,
                        { color: isCurrent ? colors.accent : colors.textTertiary },
                    ]}
                >
                    {isCurrent ? '▶' : index + 1}
                </Text>
            )}

            {/* Artwork */}
            <View
                style={[
                    styles.artwork,
                    {
                        backgroundColor: colors.skeleton,
                        borderColor: isCurrent ? colors.accent : 'transparent',
                        borderWidth: isCurrent ? 1.5 : 0,
                    },
                ]}
            >
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.artworkImage} />
                ) : (
                    <Music2 size={s(18)} color={colors.textTertiary} />
                )}
            </View>

            {/* Info */}
            <View style={styles.info}>
                <Text
                    style={[
                        styles.title,
                        { color: isCurrent ? colors.accent : colors.text },
                    ]}
                    numberOfLines={1}
                >
                    {title}
                </Text>
                <Text
                    style={[styles.meta, { color: colors.textSecondary }]}
                    numberOfLines={1}
                >
                    {artist} · {duration}
                </Text>
            </View>

            {/* Play / Pause icon */}
            <TouchableOpacity
                onPress={handlePlay}
                style={styles.playBtn}
                activeOpacity={0.6}
            >
                {isCurrent && isPlaying ? (
                    <Pause size={s(16)} color={colors.accent} fill={colors.accent} />
                ) : (
                    <Play size={s(16)} color={colors.textSecondary} fill={colors.textSecondary} />
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(10),
        borderBottomWidth: 1,
    },
    index: {
        width: s(24),
        fontSize: s(12),
        fontWeight: '600',
        textAlign: 'center',
    },
    artwork: {
        width: s(46),
        height: s(46),
        borderRadius: s(10),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    artworkImage: {
        width: '100%',
        height: '100%',
    },
    info: {
        flex: 1,
        marginLeft: s(12),
    },
    title: {
        fontSize: s(14),
        fontWeight: '600',
    },
    meta: {
        fontSize: s(11),
        marginTop: vs(2),
    },
    playBtn: {
        padding: s(10),
    },
});
