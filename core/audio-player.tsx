import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useAudioPlayer, AudioPlayer } from 'expo-audio';
import { MediaLibraryType } from './media-library';

export type SongInfo = {
    song: MediaLibraryType;
    title: string;
    artist: string;
    imageUri?: string;
};

type AudioPlayerContextType = {
    currentSong: SongInfo | null;
    isPlaying: boolean;
    queue: SongInfo[];
    play: (song: SongInfo, queue?: SongInfo[]) => void;
    pause: () => void;
    resume: () => void;
    togglePlayback: () => void;
    next: () => void;
    previous: () => void;
    setQueue: (queue: SongInfo[]) => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const useAudioPlayerContext = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) {
        throw new Error('useAudioPlayerContext must be used within an AudioPlayerProvider');
    }
    return context;
};

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentSong, setCurrentSong] = useState<SongInfo | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState<SongInfo[]>([]);
    const playerRef = useRef<AudioPlayer | null>(null);

    // We use the hook with the current song's URI
    const player = useAudioPlayer(currentSong?.song.uri ?? '');

    // Keep the ref in sync
    playerRef.current = player;

    const play = useCallback((songInfo: SongInfo, newQueue?: SongInfo[]) => {
        if (newQueue) {
            setQueue(newQueue);
        }
        setCurrentSong(songInfo);
        setIsPlaying(true);
        // The useAudioPlayer hook will re-initialize with the new URI
        // We need a slight delay for the player to load the new source
        setTimeout(() => {
            playerRef.current?.play();
        }, 100);
    }, []);

    const pause = useCallback(() => {
        playerRef.current?.pause();
        setIsPlaying(false);
    }, []);

    const resume = useCallback(() => {
        playerRef.current?.play();
        setIsPlaying(true);
    }, []);

    const togglePlayback = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            resume();
        }
    }, [isPlaying, pause, resume]);

    const next = useCallback(() => {
        if (queue.length === 0 || !currentSong) return;
        const currentIndex = queue.findIndex(
            (s) => s.song.uri === currentSong.song.uri
        );
        const nextIndex = (currentIndex + 1) % queue.length;
        play(queue[nextIndex]);
    }, [queue, currentSong, play]);

    const previous = useCallback(() => {
        if (queue.length === 0 || !currentSong) return;
        const currentIndex = queue.findIndex(
            (s) => s.song.uri === currentSong.song.uri
        );
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        play(queue[prevIndex]);
    }, [queue, currentSong, play]);

    return (
        <AudioPlayerContext.Provider
            value={{
                currentSong,
                isPlaying,
                queue,
                play,
                pause,
                resume,
                togglePlayback,
                next,
                previous,
                setQueue,
            }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
};
