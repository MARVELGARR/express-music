






import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AllSongs from './Foryou-Componets/all_songs'
import { s, vs } from 'react-native-size-matters'
import { useThemeColors } from '../../hooks/useThemeColors'
import { useMediaLibrarys } from '@/core/media-library'

const SongsCategory = () => {

    const { totalCount } = useMediaLibrarys();
    const { colors, } = useThemeColors();
    return (
        <View>
            <View style={[styles.sectionSpacing, styles.sectionHeaderRow]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    All Songs
                </Text>
                <Text style={[styles.countBadge, { color: colors.textTertiary }]}>
                    {totalCount} tracks
                </Text>
            </View>
            <AllSongs />
        </View>
    )
}

export default SongsCategory

const styles = StyleSheet.create({
    sectionSpacing: {
        marginTop: vs(16),
    },
    sectionTitle: {
        fontSize: s(17),
        fontWeight: '700',
        letterSpacing: -0.3,
        paddingHorizontal: s(16),
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: s(16),
    },
    countBadge: {
        fontSize: s(11),
        fontWeight: '500',
    },
})