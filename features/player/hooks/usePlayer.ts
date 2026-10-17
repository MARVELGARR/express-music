import {
    useAudioPlayerContext,
    useAudioPlayerState,
    useAudioPlayerControls,
    useAudioPlayerProgress,
} from '@/core/audio-player';

/**
 * Full player context (state + controls + progress).
 * Re-renders on every progress tick — use it in screens that render the
 * position. Prefer the narrow hooks below in lists/cards.
 */
export const usePlayer = useAudioPlayerContext;

/** Song/queue/loop state only — changes on user actions, not on progress ticks. */
export const usePlayerState = useAudioPlayerState;

/** Stable control callbacks only — safe to use in list rows. */
export const usePlayerControls = useAudioPlayerControls;

/** Position/duration only — for progress bars and timers. */
export const usePlayerProgress = useAudioPlayerProgress;
