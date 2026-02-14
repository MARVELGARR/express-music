import { useAudioPlayerContext } from '@/core/audio-player';

/**
 * Convenience hook for accessing the global audio player.
 * Use this in any component that needs to control or observe playback.
 */
export const usePlayer = () => {
    const context = useAudioPlayerContext();
    return context;
};
