/**
 * AllSongs — Vertical list of all audio files on the device.
 * Supports optional filtering by search query.
 */
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { useMediaLibrarys } from '@/core/media-library';
import { SongRow } from './song-row';
import { useThemeColors } from '@/features/home/hooks/useThemeColors';

type Props = {
    filter?: string;
    maxItems?: number;
};

export const AllSongs = ({ filter, maxItems }: Props) => {
    const { songs, isGettingAudios } = useMediaLibrarys();
    const { colors } = useThemeColors();

    // Simple client-side filter on filename
    let filtered = songs;
    if (filter && filter.trim()) {
        const q = filter.toLowerCase();
        filtered = songs.filter((s) =>
            s.filename.toLowerCase().includes(q)
        );
    }

    const data = maxItems ? filtered.slice(0, maxItems) : filtered;

    if (isGettingAudios) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                    Loading songs…
                </Text>
            </View>
        );
    }

    if (data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                    {filter ? 'No matching songs' : 'No songs found on device'}
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            keyExtractor={(item, idx) => item.id ?? idx.toString()}
            renderItem={({ item, index }) => (
                <SongRow
                    song={item}
                    allSongs={songs}
                    index={index}
                    showIndex
                />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: s(16),
        paddingBottom: vs(140),
    },
    emptyContainer: {
        paddingVertical: vs(40),
        alignItems: 'center',
    },
    emptyText: {
        fontSize: s(13),
        fontWeight: '500',
    },
});

export default AllSongs;