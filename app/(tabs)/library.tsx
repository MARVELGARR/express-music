import { View, Text } from 'react-native';
import React from 'react';
import { RecentlyPlayed } from '@/features/library/components/recently-played';

export default function Library() {
    return (
        <View className="flex-1 justify-center items-center bg-background">
            <Text className="text-foreground">Library</Text>

            <RecentlyPlayed />
        </View>
    );
}
