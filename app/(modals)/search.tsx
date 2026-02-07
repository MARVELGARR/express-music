import { View, Text, TextInput, TextInputChangeEvent } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Stack } from 'expo-router'
import { Search } from 'lucide-react-native';
import SearchBar from '@/features/search/component/searchBar';
import useDebounce from '@/features/universal/hooks/useDebounce';


export type ScreenType = React.ComponentProps<typeof Stack.Screen>["options"] & {
    singular?: boolean;
}





const search = () => {



    const searchRef = useRef<TextInput | null>(null)
    const [searchTerm, setSearchTerm] = useState("")



    const SCREEN_OPTIONS: ScreenType = {
        headerTitle: "",
        headerTransparent: true,
        headerRight: ({ tintColor }) => (
            <View className='flex-1 flex-row items-center '>

                <SearchBar onChange={setSearchTerm} value={searchTerm} ref={searchRef} />
            </View>
        ),


    };

    return (

        <>
            <Stack.Screen options={SCREEN_OPTIONS} />
            <View>

            </View>
        </>
    )
}

export default search