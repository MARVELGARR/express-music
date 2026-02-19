import * as MediaLibrary from "expo-media-library";
import { useState, useEffect } from "react";




export type MediaLibraryType = MediaLibrary.Asset


export const useMediaLibrarys = () =>{
    const [songs, setSongs] =useState<MediaLibraryType[]>([])
    const [isGettingAudios, setIsGettingUdios] = useState(false)
    const [recentPlays, setRecentPlays] = useState([])

    useEffect(() => {
        getPermissions();
    }, [])

    const getPermissions = async () =>{
        setIsGettingUdios(true)
        const permissions = await MediaLibrary.requestPermissionsAsync()
        if(permissions.granted){
            getAudioFiles();
        } else {
            setIsGettingUdios(false)
        }
    }

    const getAudioFiles = async () => {
        const { assets } = await MediaLibrary.getAssetsAsync({
            mediaType: MediaLibrary.MediaType.audio,
            
        });

        

        setSongs(assets);
        setIsGettingUdios(false);
    };
    const getAllAudioFiles = async () => {
        const { assets } = await MediaLibrary.getAssetsAsync({
            mediaType: MediaLibrary.MediaType.audio,
            
        });
        setSongs(assets);
        setIsGettingUdios(false);
    };
    
    return {
        songs,
        getPermissions,
        isGettingAudios,
    }
}
