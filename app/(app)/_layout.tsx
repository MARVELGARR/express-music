import { Stack } from 'expo-router';
import React from 'react';

/**
 * (app) group — detail/stack screens that sit above the tab bar.
 * These screens are full-screen and hide the tab navigator.
 * Add new detail pages inside app/(app)/ and they will automatically
 * be wrapped in this stack.
 */
const AppLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        />
    );
};

export default AppLayout;