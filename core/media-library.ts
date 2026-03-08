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
            const { assets, totalCount: total } =
                await MediaLibrary.getAssetsAsync({
                    mediaType: MediaLibrary.MediaType.audio,
                    first: 200, // load up to 200 songs
                    sortBy: [MediaLibrary.SortBy.modificationTime],
                });
            setSongs(assets);
            setTotalCount(total);
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
