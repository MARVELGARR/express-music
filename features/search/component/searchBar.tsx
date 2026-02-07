


import useDebounce from '@/features/universal/hooks/useDebounce';
import { useEffect, useRef } from 'react'
import { View, Text, TextInput, TextInputChangeEvent } from 'react-native'


type searchBarType = {
    value: string;
    ref: React.RefObject<TextInput | null>
    onChange: React.Dispatch<React.SetStateAction<string>>
}


const SearchBar = ({ onChange, value, ref }: searchBarType) => {

    useEffect(() => {
        ref.current?.focus()
    }, [])




    const { debouncedValue } = useDebounce(value)

    return (
        <View>
            <TextInput onChangeText={(value) => onChange(value)} value={value} ref={ref} placeholder='sdasdasdas' className='borders flex-1' />
        </View>
    )
}

export default SearchBar