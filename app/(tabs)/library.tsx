import { View, Text } from 'react-native';
import React from 'react';
import { RecentlyPlayed } from '@/features/library/components/recently-played';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Library() {
    return (
        <SafeAreaView  >
            <Text>ssdsdsdsd</Text>
            <View className="bg-background">


                <Text className="text-foreground">Library</Text>
                <RecentlyPlayed />
            </View>
        </SafeAreaView>
    );
}
