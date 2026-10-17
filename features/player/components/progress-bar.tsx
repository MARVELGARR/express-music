/**
 * ProgressBar — Custom scrub bar with A-B loop region overlay.
 *
 * - Tap/drag anywhere to scrub; the seek commits on release.
 * - A live time bubble follows the finger while scrubbing.
 * - When an A-B loop is armed, the region is tinted and A/B ticks are drawn,
 *   so the loop is visible right on the main progress bar.
 */
import React, { useCallback, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { s, vs } from 'react-native-size-matters';
import type { ThemeColors } from '@/features/home/hooks/useThemeColors';
import { formatClockPrecise } from '@/features/player/utils/time';

type Props = {
    position: number;
    duration: number;
    loopStart: number;
    loopEnd: number;
    loopEnabled: boolean;
    colors: ThemeColors;
    onSeek: (seconds: number) => void;
};

const BAR_HEIGHT = s(24);
const TRACK_HEIGHT = s(6);
const TICK_HEIGHT = s(16);
const THUMB_R = s(6);
const THUMB_R_ACTIVE = s(8);
const BUBBLE_W = s(58);
const TOP_ZONE = vs(24);

const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

export const ProgressBar = ({
    position,
    duration,
    loopStart,
    loopEnd,
    loopEnabled,
    colors,
    onSeek,
}: Props) => {
    const [width, setWidth] = useState(0);
    const [scrub, setScrub] = useState<number | null>(null);

    // Refs so the (stable) PanResponder always sees fresh values.
    const widthRef = useRef(0);
    const durationRef = useRef(duration);
    durationRef.current = duration;
    const onSeekRef = useRef(onSeek);
    onSeekRef.current = onSeek;
    const scrubRef = useRef<number | null>(null);
    const setScrubValue = useCallback((v: number | null) => {
        scrubRef.current = v;
        setScrub(v);
    }, []);

    const secondsAt = useCallback((x: number) => {
        const w = widthRef.current;
        const dur = durationRef.current;
        if (w <= 0 || dur <= 0) return 0;
        return clamp((x / w) * dur, 0, dur);
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                setScrubValue(
                    secondsAt(evt.nativeEvent.locationX)
                );
            },
            onPanResponderMove: (evt) => {
                setScrubValue(
                    secondsAt(evt.nativeEvent.locationX)
                );
            },
            onPanResponderRelease: () => {
                const value = scrubRef.current;
                if (value !== null) {
                    onSeekRef.current(value);
                }
                setScrubValue(null);
            },
            onPanResponderTerminate: () => setScrubValue(null),
            onPanResponderTerminationRequest: () => false,
        })
    ).current;

    const dur = duration > 0 ? duration : 0;
    const shown = scrub !== null ? scrub : position;
    const progressRatio = dur > 0 ? clamp(shown / dur, 0, 1) : 0;
    const progressX = progressRatio * width;
    const scrubbing = scrub !== null;

    const loopRatio =
        loopEnabled && dur > 0 && loopEnd > loopStart
            ? {
                  x: clamp(loopStart / dur, 0, 1) * width,
                  w: clamp((loopEnd - loopStart) / dur, 0, 1) * width,
              }
            : null;

    const bubbleX = clamp(
        progressX - BUBBLE_W / 2,
        0,
        Math.max(width - BUBBLE_W, 0)
    );
    const cy = BAR_HEIGHT / 2;

    return (
        <View
            style={styles.container}
            onLayout={(e) => {
                const w = e.nativeEvent.layout.width;
                widthRef.current = w;
                setWidth(w);
            }}
            {...panResponder.panHandlers}
        >
            {/* Time bubble */}
            {scrubbing && width > 0 && (
                <View
                    pointerEvents="none"
                    style={[
                        styles.bubble,
                        {
                            left: bubbleX,
                            backgroundColor: colors.text,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.bubbleText,
                            { color: colors.textInverted },
                        ]}
                    >
                        {formatClockPrecise(shown)}
                    </Text>
                </View>
            )}

            {width > 0 && (
                <Svg width={width} height={BAR_HEIGHT}>
                    {/* Track */}
                    <Rect
                        x={0}
                        y={cy - TRACK_HEIGHT / 2}
                        width={width}
                        height={TRACK_HEIGHT}
                        rx={TRACK_HEIGHT / 2}
                        fill={colors.divider}
                    />

                    {/* A-B loop region */}
                    {loopRatio && (
                        <Rect
                            x={loopRatio.x}
                            y={cy - TRACK_HEIGHT / 2}
                            width={Math.max(loopRatio.w, s(2))}
                            height={TRACK_HEIGHT}
                            rx={TRACK_HEIGHT / 2}
                            fill={colors.accentSoft}
                        />
                    )}

                    {/* Progress fill */}
                    <Rect
                        x={0}
                        y={cy - TRACK_HEIGHT / 2}
                        width={progressX}
                        height={TRACK_HEIGHT}
                        rx={TRACK_HEIGHT / 2}
                        fill={colors.accent}
                    />

                    {/* A / B ticks */}
                    {loopRatio && (
                        <>
                            <Rect
                                x={Math.max(loopRatio.x - s(1), 0)}
                                y={cy - TICK_HEIGHT / 2}
                                width={s(2)}
                                height={TICK_HEIGHT}
                                rx={s(1)}
                                fill={colors.accent}
                            />
                            <Rect
                                x={clamp(
                                    loopRatio.x + loopRatio.w - s(1),
                                    0,
                                    width - s(2)
                                )}
                                y={cy - TICK_HEIGHT / 2}
                                width={s(2)}
                                height={TICK_HEIGHT}
                                rx={s(1)}
                                fill={colors.accent}
                            />
                        </>
                    )}

                    {/* Thumb */}
                    <Circle
                        cx={progressX}
                        cy={cy}
                        r={scrubbing ? THUMB_R_ACTIVE : THUMB_R}
                        fill={colors.accent}
                        stroke={colors.background}
                        strokeWidth={s(3)}
                    />
                </Svg>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: TOP_ZONE + BAR_HEIGHT,
        justifyContent: 'flex-end',
        paddingTop: TOP_ZONE,
    },
    bubble: {
        position: 'absolute',
        top: 0,
        height: TOP_ZONE - vs(4),
        width: BUBBLE_W,
        borderRadius: s(6),
        alignItems: 'center',
        justifyContent: 'center',
    },
    bubbleText: {
        fontSize: s(11),
        fontWeight: '700',
        fontVariant: ['tabular-nums'],
    },
});
