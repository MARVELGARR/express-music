import React, { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { Music2, Play } from 'lucide-react-native';
import { s, vs } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MediaLibraryType, useMediaLibrarys } from '@/core/media-library';
import { usePlayerControls } from '@/features/player/hooks/usePlayer';
import { getMusicMetadata } from '@/core/music-metadata';
import { SongInfo } from '@/core/audio-player';

const RecentlyPlayedScreen = () => {
    const { songs } = useMediaLibrarys();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Recently Played</Text>
            </View>
            <FlatList
                data={songs}
                keyExtractor={(item, index) => item.id ?? index.toString()}
                renderItem={({ item }) => <SongListItem song={item} allSongs={songs} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const SongListItem = ({ song, allSongs }: { song: MediaLibraryType; allSongs: MediaLibraryType[] }) => {
    const { play } = usePlayerControls();
    const [musicInfo, setMusicInfo] = React.useState<any>(null);

    useEffect(() => {
        let active = true;
        getMusicMetadata(song.uri).then((meta) => {
            if (active) setMusicInfo(meta);
        });
        return () => {
            active = false;
        };
    }, [song.uri]);

    const title = musicInfo?.title || song.filename.split('.')[0];
    const artist = musicInfo?.artist || 'Unknown Artist';
    const imageUri = musicInfo?.picture?.pictureData;

    const handlePlay = () => {
        const songInfo: SongInfo = { song, title, artist, imageUri };
        const queue: SongInfo[] = allSongs.map((s) => ({
            song: s,
            title: s.filename.split('.')[0],
            artist: 'Unknown Artist',
        }));
        play(songInfo, queue);
    };




    return (
        <TouchableOpacity style={styles.songItem} onPress={handlePlay} activeOpacity={0.7}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.songArtwork} />
            ) : (
                <View style={styles.songArtworkPlaceholder}>
                    <Music2 size={s(20)} color="#666" />
                </View>
            )}
            <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>{title}</Text>
                <Text style={styles.songArtist} numberOfLines={1}>{artist}</Text>
            </View>
            <TouchableOpacity onPress={handlePlay} style={styles.playButton}>
                <Play size={s(16)} color="white" fill="white" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    header: {
        paddingHorizontal: s(16),
        paddingVertical: vs(16),
    },
    headerTitle: {
        color: 'white',
        fontSize: s(24),
        fontWeight: '700',
    },
    listContent: {
        paddingHorizontal: s(16),
        paddingBottom: vs(100),
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(10),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    songArtwork: {
        width: s(48),
        height: s(48),
        borderRadius: s(8),
    },
    songArtworkPlaceholder: {
        width: s(48),
        height: s(48),
        borderRadius: s(8),
        backgroundColor: '#1c1c1e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    songInfo: {
        flex: 1,
        marginLeft: s(12),
    },
    songTitle: {
        color: 'white',
        fontSize: s(15),
        fontWeight: '600',
    },
    songArtist: {
        color: '#888',
        fontSize: s(12),
        marginTop: vs(2),
    },
    playButton: {
        padding: s(10),
    },
});

export default RecentlyPlayedScreen;