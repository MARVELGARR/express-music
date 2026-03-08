/**
 * MiniPlayer — Persistent mini playback bar.
 * Modern monochrome design with progress bar, artwork, and controls.
 * Theme-aware for light/dark modes.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Music2,
} from 'lucide-react-native';
import { s, vs } from 'react-native-size-matters';
import { usePlayer } from '../hooks/usePlayer';
import { useThemeColors } from '@/features/home/hooks/useThemeColors';

export const MiniPlayer = () => {
    const {
        currentSong,
        isPlaying,
        togglePlayback,
        next,
        previous,
        position,
        duration,
    } = usePlayer();
    const { colors } = useThemeColors();

    if (!currentSong) return null;

    const progress = duration > 0 ? position / duration : 0;

    return (
        <View
            style={[
                styles.wrapper,
                {
                    backgroundColor: colors.playerBg,
                    borderColor: colors.playerBorder,
                },
            ]}
        >
            {/* Progress bar — thin line at top */}
            <View style={[styles.progressTrack, { backgroundColor: colors.divider }]}>
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${progress * 100}%`,
                            backgroundColor: colors.accent,
                        },
                    ]}
                />
            </View>

            <View style={styles.inner}>
                {/* Artwork */}
                <View
                    style={[
                        styles.artwork,
                        { backgroundColor: colors.skeleton },
                    ]}
                >
                    {currentSong.imageUri ? (
                        <Image
                            source={{ uri: currentSong.imageUri }}
                            style={styles.artworkImage}
                        />
                    ) : (
                        <Music2 size={s(16)} color={colors.textTertiary} />
                    )}
                </View>

                {/* Info */}
                <View style={styles.info}>
                    <Text
                        style={[styles.title, { color: colors.text }]}
                        numberOfLines={1}
                    >
                        {currentSong.title}
                    </Text>
                    <Text
                        style={[styles.artist, { color: colors.textSecondary }]}
                        numberOfLines={1}
                    >
                        {currentSong.artist}
                    </Text>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    <TouchableOpacity
                        onPress={previous}
                        activeOpacity={0.6}
                        hitSlop={8}
                    >
                        <SkipBack size={s(16)} color={colors.icon} fill={colors.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={togglePlayback}
                        activeOpacity={0.6}
                        style={[
                            styles.playBtn,
                            { backgroundColor: colors.accent },
                        ]}
                    >
                        {isPlaying ? (
                            <Pause
                                size={s(14)}
                                color={colors.textInverted}
                                fill={colors.textInverted}
                            />
                        ) : (
                            <Play
                                size={s(14)}
                                color={colors.textInverted}
                                fill={colors.textInverted}
                            />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={next}
                        activeOpacity={0.6}
                        hitSlop={8}
                    >
                        <SkipForward
                            size={s(16)}
                            color={colors.icon}
                            fill={colors.icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: vs(88),
        left: s(10),
        right: s(10),
        borderRadius: s(14),
        borderWidth: 1,
        overflow: 'hidden',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    progressTrack: {
        height: 2,
        width: '100%',
    },
    progressFill: {
        height: '100%',
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: s(12),
        paddingVertical: vs(10),
    },
    artwork: {
        width: s(40),
        height: s(40),
        borderRadius: s(10),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: s(12),
    },
    artworkImage: {
        width: '100%',
        height: '100%',
    },
    info: {
        flex: 1,
        marginRight: s(8),
    },
    title: {
        fontSize: s(13),
        fontWeight: '700',
    },
    artist: {
        fontSize: s(11),
        marginTop: vs(1),
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(12),
    },
    playBtn: {
        width: s(32),
        height: s(32),
        borderRadius: s(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
});
