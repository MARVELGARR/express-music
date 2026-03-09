/**
 * Albums — Horizontal or vertical list of albums.
 * Groups songs by albumId or uses MediaLibrary.getAlbumsAsync().
 */
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { s, vs } from 'react-native-size-matters';
import { useThemeColors } from '@/features/home/hooks/useThemeColors';
import { Disc } from 'lucide-react-native';

export const Albums = () => {
    const { colors } = useThemeColors();
    const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAlbums();
    }, []);

    const loadAlbums = async () => {
        try {
            const result = await MediaLibrary.getAlbumsAsync();
            setAlbums(result.filter(a => a.assetCount > 0));
        } catch (e) {
            console.error('Error loading albums:', e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Text style={{ color: colors.textTertiary }}>Loading albums...</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={albums}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[styles.albumCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                    activeOpacity={0.7}
                >
                    <View style={[styles.albumArt, { backgroundColor: colors.skeleton }]}>
                        <Disc size={s(32)} color={colors.textTertiary} strokeWidth={1} />
                    </View>
                    <View style={styles.albumInfo}>
                        <Text style={[styles.albumTitle, { color: colors.text }]} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <Text style={[styles.albumMeta, { color: colors.textSecondary }]}>
                            {item.assetCount} Tracks
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: s(16),
        paddingBottom: vs(140),
    },
    albumCard: {
        flex: 1,
        margin: s(6),
        borderRadius: s(16),
        borderWidth: 1,
        overflow: 'hidden',
        padding: s(12),
    },
    albumArt: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: s(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    albumInfo: {
        gap: vs(2),
    },
    albumTitle: {
        fontSize: s(13),
        fontWeight: '700',
    },
    albumMeta: {
        fontSize: s(11),
        fontWeight: '500',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: vs(100),
    },
});

export default Albums;
