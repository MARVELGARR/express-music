import { View, Text, TextInput, TextInputChangeEvent } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Stack } from 'expo-router'
import SearchBar from '@/features/search/component/searchBar';
import useDebounce from '@/features/universal/hooks/useDebounce';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Backpack, SkipBack } from 'lucide-react-native';


export type ScreenType = React.ComponentProps<typeof Stack.Screen>["options"] & {
    singular?: boolean;
}





export const search = () => {



    const searchRef = useRef<TextInput | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const { debouncedValue } = useDebounce(searchTerm)

    const SCREEN_OPTIONS: ScreenType = {
        headerTitle: "",
        headerShown: false,
        headerBackVisible: true,

    };

    return (

        <SafeAreaView>


            <SearchBar className="" onChange={setSearchTerm} value={searchTerm} ref={searchRef} />


        </SafeAreaView>

    )
}

export default search