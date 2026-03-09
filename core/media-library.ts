/**
 * useMediaLibrarys — Loads audio files from the device via expo-media-library.
 * Supports pagination (`first` param) and returns loading state.
 */
import * as MediaLibrary from 'expo-media-library';
import { useState, useEffect } from 'react';

export type MediaLibraryType = MediaLibrary.Asset;

export const useMediaLibrarys = () => {
    const [songs, setSongs] = useState<MediaLibraryType[]>([]);
    const [isGettingAudios, setIsGettingAudios] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        getPermissions();
    }, []);

    const getPermissions = async () => {
        setIsGettingAudios(true);
        const permissions = await MediaLibrary.requestPermissionsAsync();
        if (permissions.granted) {
            await getAudioFiles();
        } else {
            setIsGettingAudios(false);
        }
    };

    const getAudioFiles = async () => {
        try {
            let allAssets: MediaLibrary.Asset[] = [];
            let hasNextPage = true;
            let endCursor: string | undefined = undefined;

            while (hasNextPage) {
                const { assets, totalCount: total, hasNextPage: next, endCursor: cursor } =
                    await MediaLibrary.getAssetsAsync({
                        mediaType: MediaLibrary.MediaType.audio,
                        first: 100,
                        after: endCursor,
                        sortBy: [MediaLibrary.SortBy.modificationTime],
                    });
                
                allAssets = [...allAssets, ...assets];
                hasNextPage = next;
                endCursor = cursor;
                setTotalCount(total);
                setSongs([...allAssets]); // Incremental update
            }
        } catch (e) {
            console.error('Error loading audio files:', e);
        } finally {
            setIsGettingAudios(false);
        }
    };

    return {
        songs,
        totalCount,
        getPermissions,
        isGettingAudios,
        refetch: getAudioFiles,
    };
};
