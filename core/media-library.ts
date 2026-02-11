import * as MediaLibrary from "expo-media-library";
import { useState } from "react";


import { MusicInfo, MusicInfoResponse } from "expo-music-info-2"

export type MediaLibraryType = MediaLibrary.Asset & MusicInfoResponse


export const useMediaLibrarys = () =>{
    const [songs, setSongs] =useState<MediaLibraryType[]>([])
    const [isGettingAudios, setIsGettingUdios] = useState(false)

    const getPermissions = async () =>{
        setIsGettingUdios(true)
        const permissions = await MediaLibrary.requestPermissionsAsync()
        if(!permissions.granted){
            getAudioFiles();
            return setIsGettingUdios(false)
        }
        
    }

    const getAudioFiles = async () => {
        const { assets } = await MediaLibrary.getAssetsAsync({
            mediaType: MediaLibrary.MediaType.audio,
        });

        const songsWithMetadata = await Promise.all(
            assets.map(async (asset) => {
                const metadata = await MusicInfo.getMusicInfoAsync(asset.uri, {
                    album: true,
                    artist: true,
                    picture: true,
                    genre: true,
                    title: true,
                });
                return { ...asset, ...metadata };
            })
        )

        setSongs(songsWithMetadata as any);
        setIsGettingUdios(false);
    };
    
    return {
        songs,
        getPermissions,
        isGettingAudios,
    }
}
