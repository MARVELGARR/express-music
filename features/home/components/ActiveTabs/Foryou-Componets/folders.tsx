/**
 * Folders — Group songs by their directory path.
 */
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { s, vs } from 'react-native-size-matters';
import { useMediaLibrarys } from '@/core/media-library';
import { useThemeColors } from '@/features/home/hooks/useThemeColors';
import { Folder, ChevronRight } from 'lucide-react-native';

export const Folders = () => {
    const { songs, isGettingAudios } = useMediaLibrarys();
    const { colors } = useThemeColors();

    const foldersMap = songs.reduce((acc, song) => {
        const parts = song.uri.split('/');
        const folderName = parts[parts.length - 2] || 'Root';
        if (!acc[folderName]) acc[folderName] = { name: folderName, count: 0 };
        acc[folderName].count++;
        return acc;
    }, {} as Record<string, { name: string, count: number }>);

    const folders = Object.values(foldersMap);

    if (isGettingAudios && songs.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={{ color: colors.textTertiary }}>Scanning folders...</Text>
            </View>
        );
    }

    if (folders.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={{ color: colors.textTertiary }}>No folders found</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={folders}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[styles.row, { borderBottomColor: colors.divider }]}
                    activeOpacity={0.7}
                >
                    <View style={[styles.iconBox, { backgroundColor: colors.skeleton }]}>
                        <Folder size={s(20)} color={colors.textTertiary} />
                    </View>
                    <View style={styles.info}>
                        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                        <Text style={[styles.meta, { color: colors.textSecondary }]}>{item.count} files</Text>
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: vs(14),
        borderBottomWidth: 1,
    },
    iconBox: {
        width: s(48),
        height: s(48),
        borderRadius: s(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: s(16),
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: s(14),
        fontWeight: '600',
    },
    meta: {
        fontSize: s(11),
        marginTop: vs(2),
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: vs(60),
    },
});

export default Folders;
