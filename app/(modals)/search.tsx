




import { TextInput, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Stack } from 'expo-router'
import SearchBar from '@/features/search/component/searchBar';
import useDebounce from '@/features/universal/hooks/useDebounce';
import { SafeAreaView } from 'react-native-safe-area-context';
import Backbutton from '@/features/universal/components/back-button';


export type ScreenType = React.ComponentProps<typeof Stack.Screen>["options"] & {
    singular?: boolean;
}





export const Search = () => {



    const searchRef = useRef<TextInput | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const { debouncedValue } = useDebounce(searchTerm)


    return (

        <SafeAreaView>

            <View className='flex flex-row items-center px-2 mt-2'>

                <Backbutton className=' w-10 ' />

                <SearchBar className=" flex-1" onChange={setSearchTerm} value={searchTerm} ref={searchRef} />
            </View>



        </SafeAreaView>

    )
}

export default Search