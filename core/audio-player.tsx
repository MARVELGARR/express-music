/**
 * AudioPlayerProvider — Global audio state manager.
 *
 * Performance notes:
 *   - A single native player is created once and reused for every song
 *     (`replace()`), instead of recreating it per track (which previously
 *     also forced a fragile `setTimeout` before `play()`).
 *   - Playback progress comes from native `playbackStatusUpdate` events via
 *     `useAudioPlayerStatus` — no JS polling interval.
 *   - The context is split into three providers (state / controls /
 *     progress). Progress ticks every ~250 ms, so only components that
 *     actually render the position re-render at that rate.
 *
 * Feature: A-B loop — arm a section of the song (e.g. 1.00s → 1.50s) and
 * the player will jump back to A every time it reaches B, counting laps.
 */
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { MediaLibraryType } from './media-library';
import { storage } from './storage';

/* ─── Types ─── */

export type SongInfo = {
    song: MediaLibraryType;
    title: string;
    artist: string;
    imageUri?: string;
};

export type RepeatMode = 'off' | 'all' | 'one';

/** Smallest allowed A-B loop length (seconds). */
export const MIN_LOOP_LENGTH = 0.1;

type AudioPlayerStateValue = {
    currentSong: SongInfo | null;
    isPlaying: boolean;
    queue: SongInfo[];
    shuffled: boolean;
    repeatMode: RepeatMode;

    // A-B loop
    loopEnabled: boolean;
    loopStart: number; // seconds
    loopEnd: number; // seconds
    loopIterations: number;
};

type AudioPlayerControlsValue = {
    play: (song: SongInfo, queue?: SongInfo[]) => void;
    pause: () => void;
    resume: () => void;
    togglePlayback: () => void;
    next: () => void;
    previous: () => void;
    setQueue: (queue: SongInfo[]) => void;
    toggleShuffle: () => void;
    cycleRepeat: () => void;
    seekTo: (seconds: number) => void;

    // A-B loop
    toggleLoop: () => void;
    clearLoop: () => void;
    setLoopRange: (start: number, end: number) => void;
    setLoopStart: (seconds: number) => void;
    setLoopEnd: (seconds: number) => void;
};

type AudioPlayerProgressValue = {
    position: number; // seconds
    duration: number; // seconds
};

export type AudioPlayerContextValue = AudioPlayerStateValue &
    AudioPlayerControlsValue &
    AudioPlayerProgressValue;

const StateContext = createContext<AudioPlayerStateValue | null>(null);
const ControlsContext = createContext<AudioPlayerControlsValue | null>(null);
const ProgressContext = createContext<AudioPlayerProgressValue | null>(null);

/* ─── Hooks ─── */

const useRequired = <T,>(context: React.Context<T | null>, name: string): T => {
    const value = useContext(context);
    if (value === null) {
        throw new Error(`${name} must be used within an AudioPlayerProvider`);
    }
    return value;
};

export const useAudioPlayerState = () =>
    useRequired(StateContext, 'useAudioPlayerState');

export const useAudioPlayerControls = () =>
    useRequired(ControlsContext, 'useAudioPlayerControls');

export const useAudioPlayerProgress = () =>
    useRequired(ProgressContext, 'useAudioPlayerProgress');

/** Full context (state + controls + progress). Prefer the narrow hooks in
 *  list-heavy components so position ticks don't re-render them. */
export const useAudioPlayerContext = (): AudioPlayerContextValue => {
    const state = useAudioPlayerState();
    const controls = useAudioPlayerControls();
    const progress = useAudioPlayerProgress();
    return useMemo(
        () => ({ ...state, ...controls, ...progress }),
        [state, controls, progress]
    );
};

/* ─── Helpers ─── */

const shuffleCopy = <T,>(input: T[]): T[] => {
    const arr = [...input];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const STATUS_UPDATE_INTERVAL = 250; // ms
const LOOP_WATCHDOG_INTERVAL = 30; // ms — only alive while a loop is armed
const LOOP_SEEK_RETRY_MS = 500;

/* ─── Provider ─── */

export const AudioPlayerProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [currentSong, setCurrentSong] = useState<SongInfo | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState<SongInfo[]>([]);
    const [shuffled, setShuffled] = useState(false);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    const [loopEnabled, setLoopEnabledState] = useState(false);
    const [loopStart, setLoopStartState] = useState(0);
    const [loopEnd, setLoopEndState] = useState(0);
    const [loopIterations, setLoopIterations] = useState(0);

    // One stable native player for the whole app lifetime. The source is
    // attached later with `replace()` so the player is never recreated.
    const player = useAudioPlayer(null, {
        updateInterval: STATUS_UPDATE_INTERVAL,
    });
    const status = useAudioPlayerStatus(player);

    const playerRef = useRef(player);
    playerRef.current = player;

    // Refs mirror state so long-lived callbacks and the loop watchdog always
    // read fresh values without being re-created.
    const currentSongRef = useRef<SongInfo | null>(null);
    const queueRef = useRef<SongInfo[]>([]);
    const shuffledRef = useRef(false);
    const repeatModeRef = useRef<RepeatMode>('off');
    const positionRef = useRef(0);
    const durationRef = useRef(0);
    const loopRef = useRef({ enabled: false, start: 0, end: 0 });

    useEffect(() => {
        currentSongRef.current = currentSong;
    }, [currentSong]);
    useEffect(() => {
        queueRef.current = queue;
    }, [queue]);
    useEffect(() => {
        shuffledRef.current = shuffled;
    }, [shuffled]);
    useEffect(() => {
        repeatModeRef.current = repeatMode;
    }, [repeatMode]);
    useEffect(() => {
        loopRef.current = {
            enabled: loopEnabled && loopEnd > loopStart,
            start: loopStart,
            end: loopEnd,
        };
    }, [loopEnabled, loopStart, loopEnd]);

    /* ─── Sync with native status events ─── */

    useEffect(() => {
        const t = status.currentTime ?? 0;
        positionRef.current = t;
        setPosition(t);
        if (status.duration > 0) {
            durationRef.current = status.duration;
            setDuration(status.duration);
        }
    }, [status.currentTime, status.duration]);

    // Keep isPlaying honest (track end, interruptions, audio focus...).
    useEffect(() => {
        setIsPlaying(status.playing);
    }, [status.playing]);

    /* ─── A-B loop watchdog ─── */
    const loopArmed = loopEnabled && loopEnd > loopStart;

    useEffect(() => {
        if (!loopArmed || !isPlaying) return;
        const seekPending = { value: false };
        const lastSeekAt = { value: 0 };

        const id = setInterval(() => {
            const p = playerRef.current;
            const loop = loopRef.current;
            if (!p || !loop.enabled || !p.playing) return;

            const t = p.currentTime;
            if (!Number.isFinite(t)) return;

            if (t >= loop.end) {
                const now = Date.now();
                if (
                    seekPending.value &&
                    now - lastSeekAt.value < LOOP_SEEK_RETRY_MS
                ) {
                    return;
                }
                seekPending.value = true;
                lastSeekAt.value = now;
                p.seekTo(loop.start);
                positionRef.current = loop.start;
                setPosition(loop.start);
                setLoopIterations((n) => n + 1);
            } else {
                seekPending.value = false;
            }
        }, LOOP_WATCHDOG_INTERVAL);

        return () => clearInterval(id);
    }, [loopArmed, isPlaying]);

    /* ─── Controls ─── */

    const play = useCallback((songInfo: SongInfo, newQueue?: SongInfo[]) => {
        if (newQueue) setQueue(newQueue);

        const p = playerRef.current;
        const isSameSong =
            currentSongRef.current?.song.uri === songInfo.song.uri;
        currentSongRef.current = songInfo;
        setCurrentSong(songInfo);

        if (isSameSong) {
            // Restart without reloading the native source.
            p.seekTo(0);
        } else {
            // New song: drop any armed A-B loop from the previous track.
            loopRef.current = { enabled: false, start: 0, end: 0 };
            setLoopEnabledState(false);
            setLoopStartState(0);
            setLoopEndState(0);
            setLoopIterations(0);
            p.replace(songInfo.song.uri);
        }

        p.play();
        setIsPlaying(true);
        positionRef.current = 0;
        setPosition(0);

        // Fire-and-forget persistence; never blocks playback.
        storage.incrementPlayCount(songInfo.song.uri).catch(() => {});
    }, []);

    const pause = useCallback(() => {
        playerRef.current.pause();
        setIsPlaying(false);
    }, []);

    const resume = useCallback(() => {
        playerRef.current.play();
        setIsPlaying(true);
    }, []);

    const togglePlayback = useCallback(() => {
        if (!currentSongRef.current) return;
        const p = playerRef.current;
        if (p.playing) {
            p.pause();
            setIsPlaying(false);
        } else {
            p.play();
            setIsPlaying(true);
        }
    }, []);

    const next = useCallback(() => {
        const q = queueRef.current;
        const cur = currentSongRef.current;
        if (q.length === 0 || !cur) return;

        if (repeatModeRef.current === 'one') {
            play(cur);
            return;
        }

        const list = shuffledRef.current ? shuffleCopy(q) : q;
        const idx = list.findIndex((s) => s.song.uri === cur.song.uri);
        const nextIdx = (idx + 1) % list.length;

        if (nextIdx === 0 && repeatModeRef.current === 'off') {
            // End of queue: stop and rewind so pressing play restarts the last song.
            playerRef.current.pause();
            playerRef.current.seekTo(0);
            positionRef.current = 0;
            setPosition(0);
            setIsPlaying(false);
            return;
        }
        play(list[nextIdx]);
    }, [play]);

    // Auto-advance when a track finishes (also covers loop misses at track end).
    const nextRef = useRef(next);
    nextRef.current = next;

    useEffect(() => {
        if (!status.didJustFinish || status.playing) return;
        if (loopRef.current.enabled) {
            const p = playerRef.current;
            p.seekTo(loopRef.current.start);
            positionRef.current = loopRef.current.start;
            setPosition(loopRef.current.start);
            setLoopIterations((n) => n + 1);
            p.play();
            setIsPlaying(true);
            return;
        }
        nextRef.current();
    }, [status.didJustFinish, status.playing]);

    const previous = useCallback(() => {
        // More than 3s in: restart the current song.
        if (positionRef.current > 3) {
            playerRef.current.seekTo(0);
            positionRef.current = 0;
            setPosition(0);
            return;
        }
        const q = queueRef.current;
        const cur = currentSongRef.current;
        if (q.length === 0 || !cur) return;
        const idx = q.findIndex((s) => s.song.uri === cur.song.uri);
        const prevIdx = (idx - 1 + q.length) % q.length;
        play(q[prevIdx]);
    }, [play]);

    const toggleShuffle = useCallback(() => setShuffled((p) => !p), []);

    const cycleRepeat = useCallback(() => {
        setRepeatMode((prev) => {
            if (prev === 'off') return 'all';
            if (prev === 'all') return 'one';
            return 'off';
        });
    }, []);

    const seekTo = useCallback((seconds: number) => {
        const dur = durationRef.current;
        let target = Math.max(0, seconds);
        if (dur > 0) target = Math.min(target, dur);
        playerRef.current.seekTo(target);
        positionRef.current = target;
        setPosition(target);
    }, []);

    /* ─── A-B loop controls ─── */

    const applyLoopRange = useCallback((a: number, b: number) => {
        const dur = durationRef.current || 0;
        let s = Math.max(0, a);
        let e = Math.max(0, b);
        if (e < s) [s, e] = [e, s];
        if (dur > 0) {
            s = Math.min(s, dur);
            e = Math.min(e, dur);
        }
        if (e - s < MIN_LOOP_LENGTH) {
            if (dur > 0 && s + MIN_LOOP_LENGTH > dur) {
                s = Math.max(0, dur - MIN_LOOP_LENGTH);
                e = dur;
            } else {
                e = s + MIN_LOOP_LENGTH;
            }
        }
        loopRef.current = { ...loopRef.current, start: s, end: e };
        setLoopStartState(s);
        setLoopEndState(e);
    }, []);

    const setLoopRange = useCallback(
        (start: number, end: number) => {
            applyLoopRange(start, end);
            setLoopIterations(0);
        },
        [applyLoopRange]
    );

    const setLoopStart = useCallback(
        (seconds: number) => {
            applyLoopRange(seconds, loopRef.current.end);
            setLoopIterations(0);
        },
        [applyLoopRange]
    );

    const setLoopEnd = useCallback(
        (seconds: number) => {
            applyLoopRange(loopRef.current.start, seconds);
            setLoopIterations(0);
        },
        [applyLoopRange]
    );

    const toggleLoop = useCallback(() => {
        if (loopRef.current.enabled) {
            loopRef.current = { ...loopRef.current, enabled: false };
            setLoopEnabledState(false);
            return;
        }

        const dur = durationRef.current || 0;
        const { start: currentStart, end: currentEnd } = loopRef.current;

        // First arm: default to a 10s segment from the playhead.
        if (!(currentEnd > currentStart)) {
            let start = positionRef.current;
            let end = dur > 0 ? Math.min(start + 10, dur) : start + 10;
            if (dur > 0 && end - start < MIN_LOOP_LENGTH) {
                start = Math.max(0, end - MIN_LOOP_LENGTH);
            }
            applyLoopRange(start, end);
        }

        loopRef.current = { ...loopRef.current, enabled: true };
        setLoopEnabledState(true);
        setLoopIterations(0);

        // If the playhead sits outside the loop, jump to A.
        const { start, end } = loopRef.current;
        const pos = positionRef.current;
        if (pos < start || pos > end) {
            seekTo(start);
        }
    }, [applyLoopRange, seekTo]);

    const clearLoop = useCallback(() => {
        loopRef.current = { enabled: false, start: 0, end: 0 };
        setLoopEnabledState(false);
        setLoopStartState(0);
        setLoopEndState(0);
        setLoopIterations(0);
    }, []);

    /* ─── Context values (memoized per concern) ─── */

    const stateValue = useMemo<AudioPlayerStateValue>(
        () => ({
            currentSong,
            isPlaying,
            queue,
            shuffled,
            repeatMode,
            loopEnabled,
            loopStart,
            loopEnd,
            loopIterations,
        }),
        [
            currentSong,
            isPlaying,
            queue,
            shuffled,
            repeatMode,
            loopEnabled,
            loopStart,
            loopEnd,
            loopIterations,
        ]
    );

    const controlsValue = useMemo<AudioPlayerControlsValue>(
        () => ({
            play,
            pause,
            resume,
            togglePlayback,
            next,
            previous,
            setQueue,
            toggleShuffle,
            cycleRepeat,
            seekTo,
            toggleLoop,
            clearLoop,
            setLoopRange,
            setLoopStart,
            setLoopEnd,
        }),
        [
            play,
            pause,
            resume,
            togglePlayback,
            next,
            previous,
            toggleShuffle,
            cycleRepeat,
            seekTo,
            toggleLoop,
            clearLoop,
            setLoopRange,
            setLoopStart,
            setLoopEnd,
        ]
    );

    const progressValue = useMemo<AudioPlayerProgressValue>(
        () => ({ position, duration }),
        [position, duration]
    );

    return (
        <StateContext.Provider value={stateValue}>
            <ControlsContext.Provider value={controlsValue}>
                <ProgressContext.Provider value={progressValue}>
                    {children}
                </ProgressContext.Provider>
            </ControlsContext.Provider>
        </StateContext.Provider>
    );
};
