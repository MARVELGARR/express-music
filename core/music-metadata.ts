/**
 * music-metadata — Cached wrapper around expo-music-info-2.
 *
 * Reading ID3 tags hits native code per call. Lists recycle rows constantly,
 * so we memoize by file uri and de-duplicate concurrent reads for the same
 * file. Failed reads are cached too (as `null`) so broken files don't retry
 * on every scroll.
 */
import MusicInfo from 'expo-music-info-2';

export type MusicMetadata = {
    title?: string;
    artist?: string;
    album?: string;
    genre?: string;
    picture?: { description?: string; pictureData?: string };
};

const cache = new Map<string, MusicMetadata | null>();
const pending = new Map<string, Promise<MusicMetadata | null>>();

export const getMusicMetadata = (
    uri: string
): Promise<MusicMetadata | null> => {
    const cached = cache.get(uri);
    if (cached !== undefined) return Promise.resolve(cached);

    const inFlight = pending.get(uri);
    if (inFlight) return inFlight;

    const promise = MusicInfo.getMusicInfoAsync(uri, {
        title: true,
        artist: true,
        album: true,
        picture: true,
    })
        .then((data) => {
            const meta = (data as MusicMetadata | null | undefined) ?? null;
            cache.set(uri, meta);
            return meta;
        })
        .catch(() => {
            cache.set(uri, null);
            return null;
        })
        .finally(() => {
            pending.delete(uri);
        });

    pending.set(uri, promise);
    return promise;
};
