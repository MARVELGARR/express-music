

import { Stack } from 'expo-router'
import React from 'react'

const _layout = () => {
    return (

        <Stack screenOptions={{
            headerShown: false,
            presentation: "modal"
        }} />

    )
}

export default _layout