

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
        const timeOut = setTimeout(() => {

            ref.current?.focus()
        }, 500)

        return () => clearTimeout(timeOut)
    }, [])

    return (
        <Pressable style={{ height: 30 }} className={cn(className, '  flex items-center flex-row border rounded-md')} onPress={() => ref.current?.focus()}>

            <Search style={{ marginLeft: 4 }} size={20} className=' ' />
            <TextInput style={{ marginLeft: 4, height: 40 }} className=' border-none outline-none' onChangeText={(value) => onChange(value)} value={value} ref={ref} placeholder='Search songs, playlist and artist...' />

        </Pressable>
    )
}

export default SearchBar