






import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { s, vs } from 'react-native-size-matters'
import Artists from './Foryou-Componets/artists'
import { useThemeColors } from '../../hooks/useThemeColors'

const ArtistCategory = () => {

    const { colors, } = useThemeColors();
    return (
        <View>
            <View style={[styles.sectionSpacing, styles.sectionHeaderRow]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    All Artists
                </Text>
                <Text style={[styles.countBadge, { color: colors.textTertiary }]}>
                    Device Artists
                </Text>
            </View>
            <Artists />
        </View>
    )
}

export default ArtistCategory


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