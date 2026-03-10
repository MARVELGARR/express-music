



import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { s, vs } from 'react-native-size-matters'
import { useThemeColors } from '../../hooks/useThemeColors';
import { RecentlyPlayed } from '@/features/library/components/recently-played';
import { categoryTags } from '../../constants';
import { CategoryFilter } from '../../category';

import { useMediaLibrarys } from '@/core/media-library';
import MostPlayed from './Foryou-Componets/most-played';
import Favourites from './Foryou-Componets/favourites';
import Albums from './Foryou-Componets/albums';
import Artists from './Foryou-Componets/artists';
import { Folders } from 'lucide-react-native';
import AllSongs from './Foryou-Componets/all_songs';

export const ForYouCategory = () => {
    const { colors, isDark, } = useThemeColors();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { totalCount } = useMediaLibrarys();



    return (
        <View>
            {selectedCategory === 'All' ? (
                <View>
                    {/* Recently Played */}
                    <RecentlyPlayed />

                    {/* Category filters */}
                    <View style={styles.sectionSpacing}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Browse
                        </Text>
                        <CategoryFilter
                            categories={categoryTags}
                            selected={selectedCategory}
                            onSelect={setSelectedCategory}
                        />
                    </View>

                    {/* Songs list preview */}
                    <View style={styles.sectionSpacing}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                All Songs
                            </Text>
                            <Text style={[styles.countBadge, { color: colors.textTertiary }]}>
                                {totalCount} tracks
                            </Text>
                        </View>
                    </View>
                    <AllSongs maxItems={15} />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={styles.sectionSpacing}>
                        <CategoryFilter
                            categories={categoryTags}
                            selected={selectedCategory}
                            onSelect={setSelectedCategory}
                        />
                    </View>
                    <View style={[styles.sectionSpacing, styles.sectionHeaderRow]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {selectedCategory}
                        </Text>
                    </View>

                    <View>
                        <ForyouCategory category={selectedCategory} />
                    </View>

                </View>
            )}
        </View>
    )

}


const ForyouCategory = ({ category }: { category: string }) => {

    switch (category) {
        case "Recently Played":
            return <AllSongs />
        case "Most Played":
            return <MostPlayed />
        case "Favourites":
            return <Favourites />
        case "Albums":
            return <Albums />
        case "Artists":
            return <Artists />
        case "Folders":
            return <Folders />

        default:
            break;
    }
}

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