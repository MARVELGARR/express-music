


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Albums from './Foryou-Componets/albums'
import { s, vs } from 'react-native-size-matters'
import { useThemeColors } from '../../hooks/useThemeColors'

const AlbumCategory = () => {
    const { colors, isDark, } = useThemeColors();
    return (
        <View>
            <View style={[styles.sectionSpacing, styles.sectionHeaderRow]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    All Albums
                </Text>
                <Text style={[styles.countBadge, { color: colors.textTertiary }]}>
                    Device Albums
                </Text>
            </View>
            <Albums />
        </View>
    )
}

export default AlbumCategory

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