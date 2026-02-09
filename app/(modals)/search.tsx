




import { TextInput, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Stack } from 'expo-router'
import SearchBar from '@/features/search/component/searchBar';
import RecentSearch from '@/features/search/component/resent-search';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
import SearchResults from '@/features/search/component/search-results';
>>>>>>> 5c9447a8a5722c1246a1170b4b01de615692d817
=======
import SearchResults from '@/features/search/component/search-results';
>>>>>>> 5c9447a8a5722c1246a1170b4b01de615692d817
=======
import SearchResults from '@/features/search/component/search-results';
>>>>>>> 5c9447a8a5722c1246a1170b4b01de615692d817
import useDebounce from '@/features/universal/hooks/useDebounce';
import useSearchResults from '@/features/search/hooks/useSearchResults';
import { SafeAreaView } from 'react-native-safe-area-context';
import Backbutton from '@/features/universal/components/back-button';
import AsyncStorage from '@react-native-async-storage/async-storage';


export type ScreenType = React.ComponentProps<typeof Stack.Screen>["options"] & {
    singular?: boolean;
}

const RECENT_SEARCHES_KEY = 'recentSearches';

const saveSearchToRecent = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    try {
        const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        const recentSearches = stored ? JSON.parse(stored) : [];
        
        // Remove duplicate and add to front
        const filtered = recentSearches.filter((item: string) => item !== searchTerm);
        const updated = [searchTerm, ...filtered].slice(0, 10); // Keep max 10 searches
        
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Failed to save search:', error);
    }
};

export const Search = () => {
    const searchRef = useRef<TextInput | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const { debouncedValue } = useDebounce(searchTerm)
    const { results, loading } = useSearchResults(debouncedValue)

    const handleResultSelect = (result: any) => {
        saveSearchToRecent(result.title);
    }

    return (
        <SafeAreaView className='flex-1'>
            <View className='flex flex-row items-center px-2 mt-2'>
                <Backbutton className='w-10' />
                <SearchBar className="flex-1" onChange={setSearchTerm} value={searchTerm} ref={searchRef} />
            </View>

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            <RecentSearch onSearchSelect={setSearchTerm} />

=======
=======
>>>>>>> 5c9447a8a5722c1246a1170b4b01de615692d817
=======
>>>>>>> 5c9447a8a5722c1246a1170b4b01de615692d817
            {debouncedValue.trim() ? (
                <SearchResults 
                    results={results} 
                    loading={loading}
                    onResultSelect={handleResultSelect}
                />
            ) : (
                <RecentSearch onSearchSelect={setSearchTerm} />
            )}
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 5c9447a8a5722c1246a1170b4b01de615692d817
=======
>>>>>>> 5c9447a8a5722c1246a1170b4b01de615692d817
=======
>>>>>>> 5c9447a8a5722c1246a1170b4b01de615692d817
        </SafeAreaView>
    )
}

export default Search
