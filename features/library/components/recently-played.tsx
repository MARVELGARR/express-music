



import { View, Text, ScrollView, ImageBackground } from 'react-native'
import React from 'react'
import { Loader2 } from 'lucide-react-native';

import { MediaLibraryType, useMediaLibrarys } from '@/core/media-library';

export const RecentlyPlayed = () => {

    const { songs, isGettingAudios } = useMediaLibrarys()

    if (isGettingAudios) {
        return <Loader2 />
    }
    return (
        <ScrollView>
            {
                songs.map((song, index) => (
                    <RecentlyPlayedItem key={index} song={song} />
                ))
            }
        </ScrollView>
    )
}



const RecentlyPlayedItem = ({ song }: { song: MediaLibraryType }) => {

    return (

        <ImageBackground source={{ uri: song.uri }}>
            <Text>{JSON.stringify(song.filename)}</Text>

        </ImageBackground>

    )
}