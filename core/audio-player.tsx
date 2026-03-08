/**
 * AudioPlayerProvider — Global audio state manager.
 * Supports play, pause, resume, next, previous, shuffle, repeat modes,
 * and progress tracking (position + duration).
 */
import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
} from 'react';
import { useAudioPlayer, AudioPlayer } from 'expo-audio';
import { MediaLibraryType } from './media-library';

/* ─── Types ─── */

export type SongInfo = {
    song: MediaLibraryType;
    title: string;
    artist: string;
    imageUri?: string;
};

export type RepeatMode = 'off' | 'all' | 'one';

type AudioPlayerContextType = {
    currentSong: SongInfo | null;
    isPlaying: boolean;
    queue: SongInfo[];
    shuffled: boolean;
    repeatMode: RepeatMode;

    // Progress
    position: number; // seconds
    duration: number; // seconds

    // Controls
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
};

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const useAudioPlayerContext = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) {
        throw new Error(
            'useAudioPlayerContext must be used within an AudioPlayerProvider'
        );
    }
    return context;
};

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

    const playerRef = useRef<AudioPlayer | null>(null);

    // Use the hook with the current song URI
    const player = useAudioPlayer(currentSong?.song.uri ?? '');
    playerRef.current = player;

    // Progress polling
    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            if (playerRef.current) {
                setPosition(playerRef.current.currentTime ?? 0);
                setDuration(playerRef.current.duration ?? 0);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [isPlaying]);

    const play = useCallback(
        (songInfo: SongInfo, newQueue?: SongInfo[]) => {
            if (newQueue) setQueue(newQueue);
            setCurrentSong(songInfo);
            setIsPlaying(true);
            setPosition(0);
            setTimeout(() => {
                playerRef.current?.play();
            }, 100);
        },
        []
    );

    const pause = useCallback(() => {
        playerRef.current?.pause();
        setIsPlaying(false);
    }, []);

    const resume = useCallback(() => {
        playerRef.current?.play();
        setIsPlaying(true);
    }, []);

    const togglePlayback = useCallback(() => {
        if (isPlaying) pause();
        else resume();
    }, [isPlaying, pause, resume]);

    /* ─── Shuffle helper ─── */
    const getPlayQueue = useCallback(() => {
        if (!shuffled) return queue;
        // Fisher‑Yates shallow copy shuffle
        const arr = [...queue];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }, [queue, shuffled]);

    const next = useCallback(() => {
        if (queue.length === 0 || !currentSong) return;
        const q = shuffled ? getPlayQueue() : queue;
        const idx = q.findIndex((s) => s.song.uri === currentSong.song.uri);
        if (repeatMode === 'one') {
            play(currentSong);
            return;
        }
        const nextIdx = (idx + 1) % q.length;
        if (nextIdx === 0 && repeatMode === 'off') return; // end of list
        play(q[nextIdx]);
    }, [queue, currentSong, play, shuffled, repeatMode, getPlayQueue]);

    const previous = useCallback(() => {
        if (queue.length === 0 || !currentSong) return;
        // If > 3 seconds in, restart current song
        if (position > 3) {
            play(currentSong);
            return;
        }
        const idx = queue.findIndex((s) => s.song.uri === currentSong.song.uri);
        const prevIdx = (idx - 1 + queue.length) % queue.length;
        play(queue[prevIdx]);
    }, [queue, currentSong, play, position]);

    const toggleShuffle = useCallback(() => {
        setShuffled((prev) => !prev);
    }, []);

    const cycleRepeat = useCallback(() => {
        setRepeatMode((prev) => {
            if (prev === 'off') return 'all';
            if (prev === 'all') return 'one';
            return 'off';
        });
    }, []);

    const seekTo = useCallback((seconds: number) => {
        if (playerRef.current) {
            playerRef.current.seekTo(seconds);
            setPosition(seconds);
        }
    }, []);

    return (
        <AudioPlayerContext.Provider
            value={{
                currentSong,
                isPlaying,
                queue,
                shuffled,
                repeatMode,
                position,
                duration,
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
            }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
};
