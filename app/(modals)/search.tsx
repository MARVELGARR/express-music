import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Search } from 'lucide-react-native';


export type ScreenType = React.ComponentProps<typeof Stack.Screen>["options"] & {
    singular?: boolean;
}





const search = () => {


    const

    const SCREEN_OPTIONS: ScreenType = {
        headerTitle: "",
        headerTransparent: true,
        headerRight: ({ tintColor }) => (
            <View className='flex-1 flex-row items-center '>

                <TextInput value='gdfdfgf' placeholder='fjkfdfdfkj' className='border-2 flex-1' />

                {/* <View className=' w-full gap-4 flex bg-muted flex-row items-center border-primary border p-1 rounded-xl '>
                <Search size={20} color={tintColor} />
                <Text className='text-muted-foreground '>Search songs, playlist and artist</Text>
            </View> */}
            </View>
        ),


    };

    return (

        <>
            <Stack.Screen options={SCREEN_OPTIONS} />
            <View>
                <Text>........</Text>
            </View>
        </>
    )
}

export default search