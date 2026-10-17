/**
 * ABLoopPanel — Precise A-B loop editor.
 *
 * - Drag the A/B handles to shape the loop region.
 * - Or type exact seconds (e.g. A = 1.00s, B = 1.50s) with ±0.05s nudges.
 * - "SET A / SET B" drop a marker at the current playhead.
 * - Shows a lap counter while the loop is running.
 *
 * Dragging is local-only (no context churn): the range commits on release.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    PanResponder,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';
import { Crosshair, Minus, Plus, X } from 'lucide-react-native';
import { s, vs } from 'react-native-size-matters';
import type { ThemeColors } from '@/features/home/hooks/useThemeColors';
import { MIN_LOOP_LENGTH } from '@/core/audio-player';
import { formatSeconds2 as fmt } from '@/features/player/utils/time';

type Props = {
    colors: ThemeColors;
    duration: number;
    position: number;
    loopStart: number;
    loopEnd: number;
    loopIterations: number;
    onSetRange: (start: number, end: number) => void;
    onClear: () => void;
};

const TRACK_H = s(6);
const BAR_H = vs(48);
const HANDLE_R = s(11);
const HANDLE_TOUCH_W = s(40);
const NUDGE_STEP = 0.05;

const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

export const ABLoopPanel = ({
    colors,
    duration,
    position,
    loopStart,
    loopEnd,
    loopIterations,
    onSetRange,
    onClear,
}: Props) => {
    const [width, setWidth] = useState(0);
    const [a, setA] = useState(loopStart);
    const [b, setB] = useState(loopEnd);

    // Text inputs keep their own string state while focused.
    const [aText, setAText] = useState(fmt(loopStart));
    const [bText, setBText] = useState(fmt(loopEnd));
    const aFocused = useRef(false);
    const bFocused = useRef(false);

    const dragging = useRef<'a' | 'b' | null>(null);
    const aRef = useRef(a);
    const bRef = useRef(b);
    aRef.current = a;
    bRef.current = b;

    const widthRef = useRef(0);
    const durationRef = useRef(duration);
    durationRef.current = duration;
    const onSetRangeRef = useRef(onSetRange);
    onSetRangeRef.current = onSetRange;

    // Sync with context while not editing/dragging.
    useEffect(() => {
        if (dragging.current) return;
        setA(loopStart);
        setB(loopEnd);
        if (!aFocused.current) setAText(fmt(loopStart));
        if (!bFocused.current) setBText(fmt(loopEnd));
    }, [loopStart, loopEnd]);

    const trackRef = useRef<View>(null);
    const trackPageX = useRef(0);

    const measureTrack = useCallback(() => {
        trackRef.current?.measureInWindow((x, _y, w) => {
            trackPageX.current = x;
            if (w > 0) {
                widthRef.current = w;
                setWidth(w);
            }
        });
    }, []);

    const secondsAtPageX = useCallback((pageX: number) => {
        const w = widthRef.current;
        const dur = durationRef.current;
        if (w <= 0 || dur <= 0) return 0;
        return clamp(((pageX - trackPageX.current) / w) * dur, 0, dur);
    }, []);

    const commit = useCallback(() => {
        const dur = durationRef.current || 0;
        let nextA = aRef.current;
        let nextB = bRef.current;
        if (dur > 0) {
            nextB = Math.min(nextB, dur);
            nextA = Math.min(nextA, Math.max(0, nextB - MIN_LOOP_LENGTH));
        }
        if (nextB - nextA < MIN_LOOP_LENGTH) {
            nextB = Math.min(
                dur > 0 ? dur : nextA + MIN_LOOP_LENGTH,
                nextA + MIN_LOOP_LENGTH
            );
        }
        setA(nextA);
        setB(nextB);
        setAText(fmt(nextA));
        setBText(fmt(nextB));
        onSetRangeRef.current(nextA, nextB);
    }, []);

    const makeResponder = useCallback(
        (which: 'a' | 'b') =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderGrant: (evt) => {
                    dragging.current = which;
                    measureTrack();
                    const t = secondsAtPageX(evt.nativeEvent.pageX);
                    if (which === 'a') setA(t);
                    else setB(t);
                },
                onPanResponderMove: (evt) => {
                    if (dragging.current !== which) return;
                    const t = secondsAtPageX(evt.nativeEvent.pageX);
                    if (which === 'a') {
                        setA(clamp(t, 0, Math.max(bRef.current - MIN_LOOP_LENGTH, 0)));
                    } else {
                        setB(
                            clamp(
                                t,
                                aRef.current + MIN_LOOP_LENGTH,
                                durationRef.current || t
                            )
                        );
                    }
                },
                onPanResponderRelease: () => {
                    dragging.current = null;
                    commit();
                },
                onPanResponderTerminate: () => {
                    dragging.current = null;
                    commit();
                },
                onPanResponderTerminationRequest: () => false,
            }),
        [commit, measureTrack, secondsAtPageX]
    );

    const [aResponder] = useState(() => makeResponder('a'));
    const [bResponder] = useState(() => makeResponder('b'));

    const applyText = useCallback(
        (which: 'a' | 'b') => {
            const raw = which === 'a' ? aText : bText;
            const parsed = parseFloat(raw.replace(',', '.'));
            if (!Number.isFinite(parsed)) {
                setAText(fmt(aRef.current));
                setBText(fmt(bRef.current));
                return;
            }
            const dur = durationRef.current || 0;
            let nextA = which === 'a' ? parsed : aRef.current;
            let nextB = which === 'b' ? parsed : bRef.current;
            if (dur > 0) {
                nextA = clamp(nextA, 0, dur);
                nextB = clamp(nextB, 0, dur);
            }
            if (nextB - nextA < MIN_LOOP_LENGTH) {
                if (which === 'a') nextA = Math.max(0, nextB - MIN_LOOP_LENGTH);
                else nextB = Math.min(dur > 0 ? dur : nextA + MIN_LOOP_LENGTH, nextA + MIN_LOOP_LENGTH);
            }
            setA(nextA);
            setB(nextB);
            setAText(fmt(nextA));
            setBText(fmt(nextB));
            onSetRangeRef.current(nextA, nextB);
        },
        [aText, bText]
    );

    const nudge = useCallback((which: 'a' | 'b', delta: number) => {
        const dur = durationRef.current || 0;
        let nextA = aRef.current;
        let nextB = bRef.current;
        if (which === 'a') {
            nextA = clamp(nextA + delta, 0, Math.max(nextB - MIN_LOOP_LENGTH, 0));
        } else {
            nextB = clamp(
                nextB + delta,
                nextA + MIN_LOOP_LENGTH,
                dur > 0 ? dur : nextB + delta
            );
        }
        setA(nextA);
        setB(nextB);
        setAText(fmt(nextA));
        setBText(fmt(nextB));
        onSetRangeRef.current(nextA, nextB);
    }, []);

    const aX = duration > 0 ? clamp(a / duration, 0, 1) * width : 0;
    const bX = duration > 0 ? clamp(b / duration, 0, 1) * width : 0;
    const cy = BAR_H / 2;
    const lengthMs = Math.max(0, Math.round((b - a) * 1000));

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
            ]}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View
                        style={[
                            styles.liveDot,
                            { backgroundColor: colors.accent },
                        ]}
                    />
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        A-B LOOP
                    </Text>
                </View>
                <View style={styles.headerRight}>
                    <View
                        style={[
                            styles.lapsChip,
                            { backgroundColor: colors.accentSoft },
                        ]}
                    >
                        <Text
                            style={[styles.lapsText, { color: colors.text }]}
                        >
                            ×{loopIterations}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={onClear}
                        hitSlop={10}
                        style={styles.closeBtn}
                    >
                        <X size={s(16)} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Range selector */}
            <View
                ref={trackRef}
                style={styles.trackArea}
                onLayout={measureTrack}
            >
                {width > 0 && (
                    <Svg width={width} height={BAR_H}>
                        <Rect
                            x={0}
                            y={cy - TRACK_H / 2}
                            width={width}
                            height={TRACK_H}
                            rx={TRACK_H / 2}
                            fill={colors.divider}
                        />
                        {/* Selected region */}
                        <Rect
                            x={aX}
                            y={cy - TRACK_H / 2}
                            width={Math.max(bX - aX, s(2))}
                            height={TRACK_H}
                            rx={TRACK_H / 2}
                            fill={colors.accent}
                        />
                        {/* Handles */}
                        <Circle
                            cx={aX}
                            cy={cy}
                            r={HANDLE_R}
                            fill={colors.accent}
                        />
                        <SvgText
                            x={aX}
                            y={cy + s(3.5)}
                            fontSize={s(10)}
                            fontWeight="bold"
                            fill={colors.background}
                            textAnchor="middle"
                        >
                            A
                        </SvgText>
                        <Circle
                            cx={bX}
                            cy={cy}
                            r={HANDLE_R}
                            fill={colors.accent}
                        />
                        <SvgText
                            x={bX}
                            y={cy + s(3.5)}
                            fontSize={s(10)}
                            fontWeight="bold"
                            fill={colors.background}
                            textAnchor="middle"
                        >
                            B
                        </SvgText>
                    </Svg>
                )}

                {/* Drag touch targets over the handles */}
                <View style={styles.handleLayer} pointerEvents="box-none">
                    <View
                        style={[
                            styles.handleTouch,
                            { left: aX - HANDLE_TOUCH_W / 2 },
                        ]}
                        {...aResponder.panHandlers}
                    />
                    <View
                        style={[
                            styles.handleTouch,
                            { left: bX - HANDLE_TOUCH_W / 2 },
                        ]}
                        {...bResponder.panHandlers}
                    />
                </View>
            </View>

            {/* Exact time editors */}
            <View style={styles.editorsRow}>
                <MarkerEditor
                    label="START"
                    tag="A"
                    colors={colors}
                    value={aText}
                    onChangeText={setAText}
                    onFocus={() => (aFocused.current = true)}
                    onBlur={() => {
                        aFocused.current = false;
                        applyText('a');
                    }}
                    onNudge={(d) => nudge('a', d)}
                    onSetHere={() => {
                        aFocused.current = false;
                        onSetRangeRef.current(
                            clamp(position, 0, Math.max(0, bRef.current - MIN_LOOP_LENGTH)),
                            bRef.current
                        );
                    }}
                />
                <MarkerEditor
                    label="END"
                    tag="B"
                    colors={colors}
                    value={bText}
                    onChangeText={setBText}
                    onFocus={() => (bFocused.current = true)}
                    onBlur={() => {
                        bFocused.current = false;
                        applyText('b');
                    }}
                    onNudge={(d) => nudge('b', d)}
                    onSetHere={() => {
                        bFocused.current = false;
                        onSetRangeRef.current(
                            aRef.current,
                            clamp(
                                position,
                                aRef.current + MIN_LOOP_LENGTH,
                                durationRef.current || position
                            )
                        );
                    }}
                />
            </View>

            {/* Footer info */}
            <Text style={[styles.hint, { color: colors.textTertiary }]}>
                Drag the handles or type exact seconds · {lengthMs} ms segment
            </Text>
        </View>
    );
};

/* ─── Marker editor (A or B) ─── */

const MarkerEditor = ({
    label,
    tag,
    colors,
    value,
    onChangeText,
    onFocus,
    onBlur,
    onNudge,
    onSetHere,
}: {
    label: string;
    tag: string;
    colors: ThemeColors;
    value: string;
    onChangeText: (v: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    onNudge: (delta: number) => void;
    onSetHere: () => void;
}) => (
    <View
        style={[
            styles.editor,
            { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
    >
        <Text style={[styles.editorLabel, { color: colors.textTertiary }]}>
            {tag} · {label}
        </Text>

        <View style={styles.inputRow}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                onSubmitEditing={onBlur}
                keyboardType="decimal-pad"
                selectTextOnFocus
                returnKeyType="done"
                maxLength={8}
                style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.border },
                ]}
            />
            <Text style={[styles.unit, { color: colors.textSecondary }]}>
                s
            </Text>
        </View>

        <View style={styles.editorActions}>
            <TouchableOpacity
                onPress={() => onNudge(-NUDGE_STEP)}
                style={[
                    styles.smallBtn,
                    { backgroundColor: colors.accentSoft },
                ]}
                hitSlop={6}
            >
                <Minus size={s(12)} color={colors.icon} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onNudge(NUDGE_STEP)}
                style={[
                    styles.smallBtn,
                    { backgroundColor: colors.accentSoft },
                ]}
                hitSlop={6}
            >
                <Plus size={s(12)} color={colors.icon} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onSetHere}
                style={[
                    styles.setHereBtn,
                    { backgroundColor: colors.accentSoft },
                ]}
                hitSlop={6}
            >
                <Crosshair size={s(12)} color={colors.icon} />
                <Text style={[styles.setHereText, { color: colors.icon }]}>
                    HERE
                </Text>
            </TouchableOpacity>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        borderRadius: s(16),
        borderWidth: 1,
        paddingHorizontal: s(14),
        paddingTop: vs(12),
        paddingBottom: vs(12),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(4),
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(8),
    },
    liveDot: {
        width: s(7),
        height: s(7),
        borderRadius: s(4),
    },
    headerTitle: {
        fontSize: s(11),
        fontWeight: '800',
        letterSpacing: 2,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(10),
    },
    lapsChip: {
        paddingHorizontal: s(8),
        paddingVertical: vs(3),
        borderRadius: s(8),
    },
    lapsText: {
        fontSize: s(11),
        fontWeight: '800',
        fontVariant: ['tabular-nums'],
    },
    closeBtn: {
        padding: s(2),
    },
    trackArea: {
        height: BAR_H,
        justifyContent: 'center',
    },
    handleLayer: {
        ...StyleSheet.absoluteFillObject,
    },
    handleTouch: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: HANDLE_TOUCH_W,
    },
    editorsRow: {
        flexDirection: 'row',
        gap: s(10),
        marginTop: vs(10),
    },
    editor: {
        flex: 1,
        borderRadius: s(12),
        borderWidth: 1,
        paddingHorizontal: s(10),
        paddingVertical: vs(8),
    },
    editorLabel: {
        fontSize: s(9),
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: vs(4),
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: s(4),
    },
    input: {
        flex: 1,
        fontSize: s(18),
        fontWeight: '800',
        fontVariant: ['tabular-nums'],
        paddingVertical: 0,
        paddingHorizontal: s(6),
        borderWidth: 1,
        borderRadius: s(8),
    },
    unit: {
        fontSize: s(11),
        fontWeight: '600',
    },
    editorActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(6),
        marginTop: vs(8),
    },
    smallBtn: {
        width: s(26),
        height: s(24),
        borderRadius: s(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    setHereBtn: {
        flex: 1,
        height: s(24),
        borderRadius: s(8),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s(4),
    },
    setHereText: {
        fontSize: s(9),
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    hint: {
        fontSize: s(10),
        fontWeight: '500',
        marginTop: vs(10),
        textAlign: 'center',
    },
});
