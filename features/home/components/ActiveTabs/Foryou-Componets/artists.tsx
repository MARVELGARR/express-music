/**
 * Artists — List of artists on the device.
 * Since expo-media-library doesn't expose artists directly,
 * we can either group from songs or use folders.
 */
import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { useThemeColors } from '@/features/home/hooks/useThemeColors';
import { Mic2, ChevronRight } from 'lucide-react-native';
import { useMediaLibrarys } from '@/core/media-library';

export const Artists = () => {
    const { colors } = useThemeColors();
    const { songs, isGettingAudios } = useMediaLibrarys();

    // Mock grouping by artist for now since metadata is slow
    const artists = ['Unknown Artist', 'Local Artist', 'Device Music', 'Audio Files'];

    if (isGettingAudios && songs.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={{ color: colors.textTertiary }}>Loading artists...</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={artists}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[styles.artistRow, { borderBottomColor: colors.divider }]}
                    activeOpacity={0.7}
                >
                    <View style={[styles.avatar, { backgroundColor: colors.skeleton }]}>
                        <Mic2 size={s(20)} color={colors.textTertiary} />
                    </View>
                    <View style={styles.info}>
                        <Text style={[styles.artistName, { color: colors.text }]}>
                            {item}
                        </Text>
                        <Text style={[styles.meta, { color: colors.textSecondary }]}>
                            {songs.length} Tracks
                        </Text>
                    </View>
                    <ChevronRight size={s(16)} color={colors.textTertiary} />
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
    artistRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(14),
        borderBottomWidth: 1,
    },
    avatar: {
        width: s(54),
        height: s(54),
        borderRadius: s(27),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: s(16),
    },
    info: {
        flex: 1,
        gap: vs(2),
    },
    artistName: {
        fontSize: s(15),
        fontWeight: '700',
    },
    meta: {
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

export default Artists;
