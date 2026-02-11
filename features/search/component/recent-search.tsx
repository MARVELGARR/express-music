


import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const RECENT_SEARCHES_KEY = 'recentSearches'

export default function RecentSearch({ onSearchSelect }: { onSearchSelect?: (search: string) => void }) {
    const [recentSearches, setRecentSearches] = useState<string[]>([])

    useEffect(() => {
        loadRecentSearches()
    }, [])

    const loadRecentSearches = async () => {
        try {
            const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY)
            if (stored) {
                setRecentSearches(JSON.parse(stored))
            }
        } catch (error) {
            console.error('Failed to load recent searches:', error)
        }
    }

    const removeSearch = async (search: string) => {
        const updated = recentSearches.filter((item: string) => item !== search)
        setRecentSearches(updated)
        try {
            await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
        } catch (error) {
            console.error('Failed to remove search:', error)
        }
    }

    const clearAll = async () => {
        setRecentSearches([])
        try {
            await AsyncStorage.removeItem(RECENT_SEARCHES_KEY)
        } catch (error) {
            console.error('Failed to clear searches:', error)
        }
    }

    if (recentSearches.length === 0) {
        return null
    }

    return (
        <View className='px-4 mt-6'>
            <View className='flex flex-row justify-between items-center mb-3'>
                <Text className='text-sm font-semibold'>Recent Searches</Text>
                <Pressable onPress={clearAll}>
                    <Text className='text-xs text-gray-500'>Clear all</Text>
                </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className='flex flex-row'>
                {recentSearches.map((search: string, index: number) => (
                    <Pressable
                        key={index}
                        onPress={() => onSearchSelect?.(search)}
                        className='flex flex-row items-center bg-gray-100 rounded-full px-3 py-2 mr-2'
                    >
                        <Text className='text-sm text-gray-800'>{search}</Text>
                        <Pressable
                            onPress={() => removeSearch(search)}
                            className='ml-2'
                        >
                            <X size={14} className='text-gray-600' />
                        </Pressable>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    )
}
