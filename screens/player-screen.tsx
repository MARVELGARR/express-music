/**
 * PlayerScreen — Full-screen playback interface.
 * Design: High-contrast monochrome, digital modern aesthetic.
 *
 * Features:
 *   - Adaptive artwork
 *   - Custom scrub bar with a highlighted A-B loop region
 *   - A-B loop editor: pick exact seconds (e.g. 1.00s → 1.50s) and lap counter
 *   - Playback controls (Shuffle, Repeat, Skip, Play/Pause)
 */
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Activity,
    ChevronDown,
    Music2,
    Heart,
    MoreVertical,
    Pause,
    Play,
    Repeat,
    Repeat1,
    Shuffle,
    SkipBack,
    SkipForward,
} from 'lucide-react-native';
import { s, vs } from 'react-native-size-matters';
import { useRouter } from 'expo-router';

import { usePlayer } from '@/features/player/hooks/usePlayer';
import { useThemeColors } from '@/features/home/hooks/useThemeColors';
import { ProgressBar } from '@/features/player/components/progress-bar';
import { ABLoopPanel } from '@/features/player/components/ab-loop-panel';
import { formatClock } from '@/features/player/utils/time';

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
        loopEnabled,
        loopStart,
        loopEnd,
        loopIterations,
        toggleLoop,
        clearLoop,
        setLoopRange,
    } = usePlayer();
    const { colors, isDark } = useThemeColors();
    const router = useRouter();
    const { width, height } = useWindowDimensions();

    const artSize = Math.min(width * 0.78, height * 0.34);
    const useNativeDriver = Platform.OS !== 'web';

    // Panel entrance animation
    const panelAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (loopEnabled) {
            panelAnim.setValue(0);
            Animated.spring(panelAnim, {
                toValue: 1,
                useNativeDriver,
                friction: 8,
                tension: 70,
            }).start();
        }
    }, [loopEnabled, panelAnim, useNativeDriver]);

    // Lap pulse on the A-B chip
    const pulse = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        if (!loopEnabled) {
            pulse.setValue(1);
            return;
        }
        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 0.35,
                    duration: 650,
                    useNativeDriver,
                }),
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 650,
                    useNativeDriver,
                }),
            ])
        );
        anim.start();
        return () => anim.stop();
    }, [loopEnabled, pulse, useNativeDriver]);

    if (!currentSong) {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                <Text style={{ color: colors.text }}>No song playing</Text>
            </View>
        );
    }

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
            edges={['top', 'bottom']}
        >
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.iconBtn}
                >
                    <ChevronDown size={s(24)} color={colors.icon} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text
                        style={[
                            styles.headerTitle,
                            { color: colors.textSecondary },
                        ]}
                    >
                        NOW PLAYING
                    </Text>
                </View>
                <TouchableOpacity style={styles.iconBtn}>
                    <MoreVertical size={s(20)} color={colors.icon} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Artwork */}
                <View style={styles.artworkContainer}>
                    <View
                        style={[
                            styles.artworkWrapper,
                            {
                                width: artSize,
                                height: artSize,
                                backgroundColor: colors.skeleton,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        {currentSong.imageUri ? (
                            <Image
                                source={{ uri: currentSong.imageUri }}
                                style={styles.artwork}
                            />
                        ) : (
                            <Music2
                                size={s(72)}
                                color={colors.textTertiary}
                                strokeWidth={1}
                            />
                        )}
                    </View>
                </View>

                {/* Song Info */}
                <View style={styles.infoSection}>
                    <View style={styles.titleWrapper}>
                        <Text
                            style={[styles.title, { color: colors.text }]}
                            numberOfLines={1}
                        >
                            {currentSong.title}
                        </Text>
                        <Text
                            style={[
                                styles.artist,
                                { color: colors.textSecondary },
                            ]}
                            numberOfLines={1}
                        >
                            {currentSong.artist}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.heartBtn}>
                        <Heart size={s(20)} color={colors.icon} />
                    </TouchableOpacity>
                </View>

                {/* Progress */}
                <View style={styles.progressSection}>
                    <ProgressBar
                        position={position}
                        duration={duration}
                        loopStart={loopStart}
                        loopEnd={loopEnd}
                        loopEnabled={loopEnabled}
                        colors={colors}
                        onSeek={seekTo}
                    />
                    <View style={styles.timeLabels}>
                        <Text
                            style={[
                                styles.timeText,
                                { color: colors.textTertiary },
                            ]}
                        >
                            {formatClock(position)}
                        </Text>
                        <Text
                            style={[
                                styles.timeText,
                                { color: colors.textTertiary },
                            ]}
                        >
                            {formatClock(duration)}
                        </Text>
                    </View>
                </View>

                {/* A-B loop toggle */}
                <View style={styles.abRow}>
                    <TouchableOpacity
                        onPress={toggleLoop}
                        activeOpacity={0.75}
                        style={[
                            styles.abChip,
                            {
                                backgroundColor: loopEnabled
                                    ? colors.accent
                                    : colors.accentSoft,
                            },
                        ]}
                    >
                        <Animated.View
                            style={[
                                styles.abDot,
                                {
                                    backgroundColor: loopEnabled
                                        ? colors.background
                                        : colors.textSecondary,
                                    opacity: loopEnabled ? pulse : 1,
                                },
                            ]}
                        />
                        <Activity
                            size={s(13)}
                            color={
                                loopEnabled
                                    ? colors.textInverted
                                    : colors.icon
                            }
                        />
                        <Text
                            style={[
                                styles.abChipText,
                                {
                                    color: loopEnabled
                                        ? colors.textInverted
                                        : colors.icon,
                                },
                            ]}
                        >
                            A-B LOOP
                        </Text>
                        {loopEnabled && (
                            <Text
                                style={[
                                    styles.abChipLaps,
                                    { color: colors.textInverted },
                                ]}
                            >
                                ×{loopIterations}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* A-B loop editor */}
                {loopEnabled && (
                    <Animated.View
                        style={[
                            styles.panelWrapper,
                            {
                                opacity: panelAnim,
                                transform: [
                                    {
                                        translateY: panelAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [s(24), 0],
                                        }),
                                    },
                                    {
                                        scale: panelAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.96, 1],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <ABLoopPanel
                            colors={colors}
                            duration={duration}
                            position={position}
                            loopStart={loopStart}
                            loopEnd={loopEnd}
                            loopIterations={loopIterations}
                            onSetRange={setLoopRange}
                            onClear={clearLoop}
                        />
                    </Animated.View>
                )}

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
                            <SkipBack
                                size={s(32)}
                                color={colors.icon}
                                fill={colors.icon}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={togglePlayback}
                            style={[
                                styles.playBtn,
                                { backgroundColor: colors.text },
                            ]}
                        >
                            {isPlaying ? (
                                <Pause
                                    size={s(28)}
                                    color={colors.background}
                                    fill={colors.background}
                                />
                            ) : (
                                <Play
                                    size={s(28)}
                                    color={colors.background}
                                    fill={colors.background}
                                    style={{ marginLeft: s(3) }}
                                />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={next}>
                            <SkipForward
                                size={s(32)}
                                color={colors.icon}
                                fill={colors.icon}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={cycleRepeat}>
                        {repeatMode === 'one' ? (
                            <Repeat1
                                size={s(20)}
                                color={colors.accent}
                                strokeWidth={3}
                            />
                        ) : (
                            <Repeat
                                size={s(20)}
                                color={
                                    repeatMode === 'all'
                                        ? colors.accent
                                        : colors.icon
                                }
                                strokeWidth={repeatMode === 'all' ? 3 : 2}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        height: vs(56),
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
    scrollContent: {
        flexGrow: 1,
        paddingBottom: vs(20),
    },
    artworkContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: vs(8),
        marginBottom: vs(24),
    },
    artworkWrapper: {
        borderRadius: s(20),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
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
        marginBottom: vs(22),
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
        marginBottom: vs(14),
    },
    timeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: s(10),
        marginTop: vs(-4),
    },
    timeText: {
        fontSize: s(11),
        fontWeight: '600',
        fontVariant: ['tabular-nums'],
    },
    abRow: {
        alignItems: 'center',
        marginBottom: vs(12),
    },
    abChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(6),
        paddingHorizontal: s(14),
        paddingVertical: vs(7),
        borderRadius: s(20),
    },
    abDot: {
        width: s(6),
        height: s(6),
        borderRadius: s(3),
    },
    abChipText: {
        fontSize: s(11),
        fontWeight: '800',
        letterSpacing: 1.5,
    },
    abChipLaps: {
        fontSize: s(11),
        fontWeight: '800',
        fontVariant: ['tabular-nums'],
    },
    panelWrapper: {
        paddingHorizontal: s(20),
        marginBottom: vs(14),
    },
    controlsSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: s(40),
        marginTop: vs(6),
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
});
