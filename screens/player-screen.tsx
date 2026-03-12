/**
 * PlayerScreen — Full-screen playback interface.
 * Design: High-contrast monochrome, digital modern aesthetic.
 * Features:
 *   - Large artwork view
 *   - Progress slider with precise time indicators
 *   - Detailed playback controls (Shuffle, Repeat, Skip, Play/Pause)
 *   - Header with dismiss button
 */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import {
    ChevronDown,
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Shuffle,
    Repeat,
    Repeat1,
    Music2,
    Heart,
    MoreVertical,
} from 'lucide-react-native';
import { usePlayer } from '@/features/player/hooks/usePlayer';
import { useThemeColors } from '@/features/home/hooks/useThemeColors';
import { s, vs } from 'react-native-size-matters';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

const PlayerScreen = () => {
    const {
        currentSong,
        isPlaying,
        togglePlayback,
        next,
        previous,
        position,
        duration,
        shuffled,
        repeatMode,
        toggleShuffle,
        cycleRepeat,
        seekTo,
    } = usePlayer();
    const { colors, isDark } = useThemeColors();
    const router = useRouter();

    if (!currentSong) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>No song playing</Text>
            </View>
        );
    }

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ChevronDown size={s(24)} color={colors.icon} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={[styles.headerTitle, { color: colors.textSecondary }]}>
                        NOW PLAYING
                    </Text>
                </View>
                <TouchableOpacity style={styles.iconBtn}>
                    <MoreVertical size={s(20)} color={colors.icon} />
                </TouchableOpacity>
            </View>

            {/* Artwork */}
            <View style={styles.artworkContainer}>
                <View style={[styles.artworkWrapper, { backgroundColor: colors.skeleton, borderColor: colors.border, borderWidth: 1 }]}>
                    {currentSong.imageUri ? (
                        <Image
                            source={{ uri: currentSong.imageUri }}
                            style={styles.artwork}
                        />
                    ) : (
                        <Music2 size={s(80)} color={colors.textTertiary} strokeWidth={1} />
                    )}
                </View>
            </View>

            {/* Song Info */}
            <View style={styles.infoSection}>
                <View style={styles.titleWrapper}>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                        {currentSong.title}
                    </Text>
                    <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
                        {currentSong.artist}
                    </Text>
                </View>
                <TouchableOpacity style={styles.heartBtn}>
                    <Heart size={s(20)} color={colors.icon} />
                </TouchableOpacity>
            </View>

            {/* Progress */}
            <View style={styles.progressSection}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration || 100}
                    value={position}
                    onSlidingComplete={seekTo}
                    minimumTrackTintColor={colors.accent}
                    maximumTrackTintColor={colors.divider}
                    thumbTintColor={colors.accent}
                />
                <View style={styles.timeLabels}>
                    <Text style={[styles.timeText, { color: colors.textTertiary }]}>{formatTime(position)}</Text>
                    <Text style={[styles.timeText, { color: colors.textTertiary }]}>{formatTime(duration)}</Text>
                </View>
            </View>

            {/* Controls */}
            <View style={styles.controlsSection}>
                <TouchableOpacity onPress={toggleShuffle}>
                    <Shuffle
                        size={s(20)}
                        color={shuffled ? colors.accent : colors.icon}
                        strokeWidth={shuffled ? 3 : 2}
                    />
                </TouchableOpacity>

                <View style={styles.mainControls}>
                    <TouchableOpacity onPress={previous}>
                        <SkipBack size={s(32)} color={colors.icon} fill={colors.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={togglePlayback}
                        style={[styles.playBtn, { backgroundColor: colors.text }]}
                    >
                        {isPlaying ? (
                            <Pause size={s(28)} color={colors.background} fill={colors.background} />
                        ) : (
                            <Play size={s(28)} color={colors.background} fill={colors.background} style={{ marginLeft: s(3) }} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={next}>
                        <SkipForward size={s(32)} color={colors.icon} fill={colors.icon} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={cycleRepeat}>
                    {repeatMode === 'one' ? (
                        <Repeat1 size={s(20)} color={colors.accent} strokeWidth={3} />
                    ) : (
                        <Repeat
                            size={s(20)}
                            color={repeatMode === 'all' ? colors.accent : colors.icon}
                            strokeWidth={repeatMode === 'all' ? 3 : 2}
                        />
                    )}
                </TouchableOpacity>
            </View>

            {/* Footer / Extra controls */}
            <View style={styles.footer}>
                {/* Could add share or queue buttons here */}
            </View>
        </SafeAreaView>
    );
};

export default PlayerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: s(20),
        height: vs(60),
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: s(10),
        fontWeight: '800',
        letterSpacing: 2,
    },
    iconBtn: {
        padding: s(8),
    },
    artworkContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: vs(20),
        marginBottom: vs(40),
    },
    artworkWrapper: {
        width: width * 0.85,
        height: width * 0.85,
        borderRadius: s(20),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    artwork: {
        width: '100%',
        height: '100%',
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: s(30),
        marginBottom: vs(30),
    },
    titleWrapper: {
        flex: 1,
        marginRight: s(20),
    },
    title: {
        fontSize: s(22),
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    artist: {
        fontSize: s(16),
        fontWeight: '400',
        marginTop: vs(4),
    },
    heartBtn: {
        padding: s(5),
    },
    progressSection: {
        paddingHorizontal: s(20),
        marginBottom: vs(30),
    },
    slider: {
        width: '100%',
        height: 40,
    },
    timeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: s(10),
        marginTop: vs(-8),
    },
    timeText: {
        fontSize: s(11),
        fontWeight: '600',
        fontFamily: 'monospace',
    },
    controlsSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: s(40),
        marginTop: vs(10),
    },
    mainControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(30),
    },
    playBtn: {
        width: s(64),
        height: s(64),
        borderRadius: s(32),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: vs(20),
    },
});
