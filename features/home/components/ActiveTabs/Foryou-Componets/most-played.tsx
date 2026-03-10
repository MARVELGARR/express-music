/**
 * MostPlayed — List of songs sorted by play count.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { useMediaLibrarys } from '@/core/media-library';
import { useThemeColors } from '@/features/home/hooks/useThemeColors';
import { storage } from '@/core/storage';
import { SongRow } from '@/features/library/components/song-row';

export const MostPlayed = () => {
    const { songs, isGettingAudios } = useMediaLibrarys();
    const { colors } = useThemeColors();
    const [mostPlayedSongs, setMostPlayedSongs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMostPlayed();
    }, [songs]);

    const loadMostPlayed = async () => {
        const counts = await storage.getPlayCounts();

        // Filter songs that have at least one play and sort them
        const withCounts = songs
            .filter(s => counts[s.uri] !== undefined)
            .sort((a, b) => (counts[b.uri] || 0) - (counts[a.uri] || 0));

        setMostPlayedSongs(withCounts);
        setLoading(false);
    };

    if (loading || isGettingAudios) {
        return (
            <View style={styles.center}>
                <Text style={{ color: colors.textTertiary }}>Calculating most played...</Text>
            </View>
        );
    }

    if (mostPlayedSongs.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={{ color: colors.textTertiary }}>Start playing songs to see stats!</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={mostPlayedSongs}
            keyExtractor={(item) => item.uri}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
                <SongRow
                    song={item}
                    allSongs={mostPlayedSongs}
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

export default MostPlayed;
