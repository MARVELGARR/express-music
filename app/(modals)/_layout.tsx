


import { Stack } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const _layout = () => {
    return (
        <Stack screenOptions={{
            headerShown: true,
        }}>
            <Stack.Screen name="settings" options={{
                animation: "slide_from_bottom",
                presentation: "modal",

            }} />
        </Stack>
    )
}

export default _layout