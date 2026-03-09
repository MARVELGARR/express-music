/**
 * Favourites — List of songs marked as favourites.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { useMediaLibrarys } from '@/core/media-library';
import { SongRow } from './song-row';
import { useThemeColors } from '@/features/home/hooks/useThemeColors';
import { storage } from '@/core/storage';

export const Favourites = () => {
    const { songs, isGettingAudios } = useMediaLibrarys();
    const { colors } = useThemeColors();
    const [favSongs, setFavSongs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavs();
    }, [songs]);

    const loadFavs = async () => {
        const favUris = await storage.getFavourites();
        const filtered = songs.filter(s => favUris.includes(s.uri));
        setFavSongs(filtered);
        setLoading(false);
    };

    if (loading || isGettingAudios) {
        return (
            <View style={styles.center}>
                <Text style={{ color: colors.textTertiary }}>Loading favourites...</Text>
            </View>
        );
    }

    if (favSongs.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={{ color: colors.textTertiary }}>No favourites yet</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={favSongs}
            keyExtractor={(item) => item.uri}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
                <SongRow
                    song={item}
                    allSongs={favSongs}
                    index={index}
                    showIndex
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: s(16),
        paddingBottom: vs(140),
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: vs(60),
    },
});

export default Favourites;
