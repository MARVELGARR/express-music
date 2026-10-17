/**
 * MediaLibraryProvider — Singleton loader for device audio files.
 *
 * Previously every component that called `useMediaLibrarys()` ran its own
 * paginated scan of the device media library (O(n²) array growth, one scan
 * per hook instance × ~14 instances). Now the library is loaded exactly once
 * and shared through context; `useMediaLibrarys()` simply consumes it, so all
 * existing call sites keep working unchanged.
 */
import * as MediaLibrary from 'expo-media-library';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

export type MediaLibraryType = MediaLibrary.Asset;

export const PAGE_SIZE = 200;

type MediaLibraryContextType = {
    songs: MediaLibraryType[];
    totalCount: number;
    hasPermission: boolean | null;
    /** True once an initial load attempt has finished (success or failure). */
    isLoaded: boolean;
    isGettingAudios: boolean;
    /** Requests permission (if needed) and loads the library. Safe to call repeatedly. */
    getPermissions: () => Promise<MediaLibraryType[]>;
    /** Clears the cache and re-scans the device. */
    refetch: () => Promise<MediaLibraryType[]>;
};

const MediaLibraryContext = createContext<MediaLibraryContextType | null>(null);

export const MediaLibraryProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [songs, setSongs] = useState<MediaLibraryType[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isGettingAudios, setIsGettingAudios] = useState(false);

    const inFlight = useRef<Promise<MediaLibraryType[]> | null>(null);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const load = useCallback(async (): Promise<MediaLibraryType[]> => {
        // Coalesce concurrent/repeat calls into a single scan.
        if (inFlight.current) return inFlight.current;

        const promise = (async () => {
            setIsGettingAudios(true);
            try {
                let permission = await MediaLibrary.getPermissionsAsync();
                if (!permission.granted && permission.canAskAgain) {
                    permission = await MediaLibrary.requestPermissionsAsync();
                }
                if (mounted.current) setHasPermission(permission.granted);
                if (!permission.granted) return [];

                const allAssets: MediaLibraryType[] = [];
                let endCursor: string | undefined;
                let hasNextPage = true;

                while (hasNextPage) {
                    const page = await MediaLibrary.getAssetsAsync({
                        mediaType: MediaLibrary.MediaType.audio,
                        first: PAGE_SIZE,
                        after: endCursor,
                        sortBy: [MediaLibrary.SortBy.modificationTime],
                    });

                    allAssets.push(...page.assets);
                    hasNextPage = page.hasNextPage;
                    endCursor = page.endCursor;

                    // Publish progressively so lists fill in as pages arrive.
                    if (mounted.current) {
                        setSongs([...allAssets]);
                        setTotalCount(page.totalCount);
                    }
                }
                return allAssets;
            } catch (error) {
                console.error('Error loading audio files:', error);
                return [];
            } finally {
                inFlight.current = null;
                if (mounted.current) {
                    setIsGettingAudios(false);
                    setIsLoaded(true);
                }
            }
        })();

        inFlight.current = promise;
        return promise;
    }, []);

    // Single automatic scan for the whole app lifetime.
    useEffect(() => {
        load();
    }, [load]);

    const refetch = useCallback(async () => {
        setSongs([]);
        setTotalCount(0);
        setHasPermission(null);
        return load();
    }, [load]);

    const value = useMemo(
        () => ({
            songs,
            totalCount,
            hasPermission,
            isLoaded,
            isGettingAudios,
            getPermissions: load,
            refetch,
        }),
        [songs, totalCount, hasPermission, isLoaded, isGettingAudios, load, refetch]
    );

    return (
        <MediaLibraryContext.Provider value={value}>
            {children}
        </MediaLibraryContext.Provider>
    );
};

export const useMediaLibrarys = (): MediaLibraryContextType => {
    const context = useContext(MediaLibraryContext);
    if (!context) {
        throw new Error(
            'useMediaLibrarys must be used within a MediaLibraryProvider'
        );
    }
    return context;
};
