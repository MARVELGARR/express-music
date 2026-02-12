import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { RecentlyPlayed } from '@/features/library/components/recently-played';
import { LibraryTab } from '@/features/library/components/library-tab';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Library() {
    return (
        <SafeAreaView  >
            <View className="bg-background">

                <View style={libraryStyles.title}>
                    <Text className="text-foreground text-2xl font-bold">Library</Text>
                    <TouchableOpacity>
                        <Text className='text-accent-foreground'>See all</Text>
                    </TouchableOpacity>
                </View>

                <LibraryTab />

                <View style={libraryStyles.sectionHeader}>
                    <Text className="text-foreground font-semibold">Recently Played</Text>
                </View>

                <RecentlyPlayed />
            </View>
        </SafeAreaView>
    );
}

const libraryStyles = StyleSheet.create({
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 10,
    },
    sectionHeader: {
        paddingHorizontal: 16,
        marginBottom: 10,
        marginTop: 20,
    }
})