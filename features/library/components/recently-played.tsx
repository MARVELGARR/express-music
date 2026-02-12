
import { View, Text, ScrollView, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Music2, Play } from 'lucide-react-native';
import MusicInfo from 'expo-music-info-2';

import { MediaLibraryType, useMediaLibrarys } from '@/core/media-library';

import { vs, s } from "react-native-size-matters"

import { useAudioPlayer } from 'expo-audio';

export const RecentlyPlayed = () => {

    const { songs, isGettingAudios } = useMediaLibrarys()

    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {
                songs.map((song, index) => (
                    <RecentlyPlayedItem key={index} song={song} />
                ))
            }
        </ScrollView>
    )
}

const RecentlyPlayedItem = ({ song }: { song: MediaLibraryType }) => {
    const player = useAudioPlayer(song.uri);
    const [musicInfo, setMusicInfo] = React.useState<any>(null);

    const fetchMusicInfo = async () => {
        try {
            const info = await MusicInfo.getMusicInfoAsync(song.uri, {
                title: true,
                artist: true,
                album: true,
                picture: true,
            });
            setMusicInfo(info);
        } catch (error) {
            console.error("Error fetching music info:", error);
        }
    };

    useEffect(() => {

        fetchMusicInfo();
    }, [song.uri]);

    const title = musicInfo?.title || song.filename.split(".")[0];
    const artist = musicInfo?.artist || "Unknown Artist";
    const imageUri = musicInfo?.picture?.pictureData;

    return (
        <TouchableOpacity
            onPress={() => player.play()}
            style={styles.itemContainer}
            activeOpacity={0.7}
        >
            <ImageBackground
                source={imageUri ? { uri: imageUri } : require("@/assets/images/placeholder.jpg")}
                style={styles.backgroundImage}
                imageStyle={styles.imageStyle}
            >
                {!imageUri && (
                    <View style={styles.placeholderContainer}>
                        <Music2 size={s(30)} color="#666" />
                    </View>
                )}
                <View style={styles.overlay}>
                    <Play size={s(16)} color="white" fill="white" />
                </View>
            </ImageBackground>
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={0}>{title}</Text>
                <Text style={styles.artist} numberOfLines={0}>{artist}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        width: s(120),
        height: s(120),
        borderRadius: s(12),
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
    },
    imageStyle: {
        borderRadius: s(12),
    },
    itemContainer: {
        marginRight: s(16),
        width: s(120),
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#262626',
    },
    overlay: {
        position: 'absolute',
        bottom: s(8),
        right: s(8),
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: s(6),
        borderRadius: s(20),
    },
    textContainer: {
        marginTop: vs(8),
    },
    title: {
        color: 'white',
        fontSize: s(13),
        fontWeight: '600',
    },
    artist: {
        color: '#999',
        fontSize: s(11),
        marginTop: vs(2),
    }
})
