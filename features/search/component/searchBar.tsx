

import { Search } from 'lucide-react-native';
import { useEffect, useRef } from 'react'
import { View, TextInput, Pressable, } from 'react-native'


type searchBarType = {
    value: string;
    ref: React.RefObject<TextInput | null>
    onChange: React.Dispatch<React.SetStateAction<string>>
}


const SearchBar = ({ onChange, value, ref }: searchBarType) => {

    useEffect(() => {
        ref.current?.focus()
    }, [])

    return (
        <Pressable style={{ padding: 4 }} className='w-full flex  gap-3 flex-row border rounded-md' onPress={() => ref.current?.focus()}>

            <Search style={{ marginLeft: 4 }} size={25} className=' ' />
            <TextInput style={{ marginLeft: 10 }} className='flex-1 border-none outline-none placeholder:ml-4 ' onChangeText={(value) => onChange(value)} value={value} ref={ref} placeholder='Search songs, playlist and artist...' />

        </Pressable>
    )
}

export default SearchBar