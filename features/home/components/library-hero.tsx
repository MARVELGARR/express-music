/**
 * LibraryHero — Primary anchor card on the landing page.
 * Shows library size with Play all / Shuffle CTAs.
 * Replaces the old stats bar + 2×2 quick-action grid.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Play, Shuffle } from 'lucide-react-native';
import { s, vs } from 'react-native-size-matters';

import { useMediaLibrarys } from '@/core/media-library';
import { SongInfo } from '@/core/audio-player';
import {
    usePlayerControls,
    usePlayerState,
} from '@/features/player/hooks/usePlayer';
import { useThemeColors } from '../hooks/useThemeColors';

const LibraryHero = () => {
    const { colors } = useThemeColors();
    const { songs, totalCount } = useMediaLibrarys();
    const { shuffled } = usePlayerState();
    const { play, toggleShuffle } = usePlayerControls();

    const buildQueue = (): SongInfo[] =>
        songs.map((song) => ({
            song,
            title: song.filename.split('.')[0],
            artist: 'Unknown Artist',
        }));

    const handlePlayAll = () => {
        if (songs.length === 0) return;
        const queue = buildQueue();
        play(queue[0], queue);
    };

    const handleShuffle = () => {
        if (songs.length === 0) return;
        const queue = buildQueue();
        const randomIdx = Math.floor(Math.random() * queue.length);
        play(queue[randomIdx], queue);
        if (!shuffled) toggleShuffle();
    };

    return (
        <View style={[styles.card, { backgroundColor: colors.accent }]}>
            <Text style={[styles.kicker, { color: colors.textInverted }]}>
                YOUR LIBRARY
            </Text>
            <Text style={[styles.count, { color: colors.textInverted }]}>
                {totalCount} tracks
            </Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handlePlayAll}
                    style={[
                        styles.btn,
                        { backgroundColor: colors.background },
                    ]}
                >
                    <Play size={s(15)} color={colors.text} fill={colors.text} />
                    <Text style={[styles.btnLabel, { color: colors.text }]}>
                        Play all
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleShuffle}
                    style={[
                        styles.btn,
                        styles.outlineBtn,
                        { borderColor: colors.border },
                    ]}
                >
                    <Shuffle size={s(15)} color={colors.textInverted} />
                    <Text
                        style={[styles.btnLabel, { color: colors.textInverted }]}
                    >
                        Shuffle
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LibraryHero;

const styles = StyleSheet.create({
    card: {
        marginHorizontal: s(16),
        marginTop: vs(8),
        borderRadius: s(20),
        padding: s(20),
    },
    kicker: {
        fontSize: s(10),
        fontWeight: '700',
        letterSpacing: 2,
        opacity: 0.6,
    },
    count: {
        fontSize: s(26),
        fontWeight: '800',
        letterSpacing: -0.6,
        marginTop: vs(6),
    },
    actions: {
        flexDirection: 'row',
        gap: s(10),
        marginTop: vs(18),
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s(8),
        paddingVertical: vs(11),
        paddingHorizontal: s(20),
        borderRadius: s(12),
    },
    outlineBtn: {
        borderWidth: 1,
    },
    btnLabel: {
        fontSize: s(13),
        fontWeight: '700',
    },
});
