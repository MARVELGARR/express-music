

import { Stack } from 'expo-router'
import React from 'react'

const _layout = () => {
    return (
        <Stack screenOptions={{
            headerShown: true,
            presentation: "modal"
        }} />

    )
}

export default _layout