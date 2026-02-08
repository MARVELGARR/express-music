

import { cn } from '@/lib/utils';
import { Search } from 'lucide-react-native';
import { useEffect, useRef } from 'react'
import { View, TextInput, Pressable, } from 'react-native'


type searchBarType = {
    value: string;
    ref: React.RefObject<TextInput | null>
    onChange: React.Dispatch<React.SetStateAction<string>>
    className?: string
}


const SearchBar = ({ className, onChange, value, ref }: searchBarType) => {

    useEffect(() => {
        ref.current?.focus()
    }, [])

    return (
        <Pressable style={{ height: 40 }} className={cn(className, ' flex items-center flex-row border rounded-md')} onPress={() => ref.current?.focus()}>

            <Search style={{ marginLeft: 4 }} size={25} className=' ' />
            <TextInput style={{ marginLeft: 4, }} className=' border-none outline-none ' onChangeText={(value) => onChange(value)} value={value} ref={ref} placeholder='Search songs, playlist and artist...' />

        </Pressable>
    )
}

export default SearchBar