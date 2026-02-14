import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RecentlyPlayed } from '@/features/library/components/recently-played';
import { LibraryTab } from '@/features/library/components/library-tab';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function LibraryScreen() {
    const router = useRouter();

    return (
        <SafeAreaView edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="bg-background">

                    <View style={libraryStyles.title}>
                        <Text className="text-foreground text-2xl font-bold">Library</Text>
                    </View>

                    <LibraryTab />

                    <View style={libraryStyles.sectionHeader}>
                        <Text className="text-foreground font-semibold text-lg">Recently Played</Text>
                        <TouchableOpacity
                            onPress={() => {
                                // Navigate to full recently played screen when route is set up
                            }}
                        >
                            <Text style={libraryStyles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    <RecentlyPlayed />

                </View>
            </ScrollView>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
        marginTop: 20,
    },
    seeAll: {
        color: '#8B8B8B',
        fontSize: 14,
    },
});