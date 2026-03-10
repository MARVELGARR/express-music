





import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { s, vs } from 'react-native-size-matters'
import { useThemeColors } from '../hooks/useThemeColors';
import { useMediaLibrarys } from '@/core/media-library';
import { usePlayer } from '@/features/player/hooks/usePlayer';

const StatsBar = () => {
    const { colors, isDark, toggleColorScheme } = useThemeColors();
    const { songs, totalCount } = useMediaLibrarys();
    const player = usePlayer();
    return (
        <View style={[styles.statsBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: colors.text }]}>{totalCount}</Text>
                <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Songs</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
            <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: colors.text }]}>{player.queue.length}</Text>
                <Text style={[styles.statLabel, { color: colors.textTertiary }]}>In Queue</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
            <View style={styles.stat}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                    {player.shuffled ? 'ON' : 'OFF'}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Shuffle</Text>
            </View>
        </View>
    )
}

export default StatsBar

const styles = StyleSheet.create({
    statsBar: {
        flexDirection: 'row',
        marginHorizontal: s(16),
        marginTop: vs(4),
        paddingVertical: vs(12),
        paddingHorizontal: s(16),
        borderRadius: s(14),
        borderWidth: 1,
        alignItems: 'center',
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: s(16),
        fontWeight: '800',
    },
    statLabel: {
        fontSize: s(10),
        fontWeight: '500',
        marginTop: vs(2),
    },
    statDivider: {
        width: 1,
        height: vs(24),
    },
})