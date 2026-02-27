import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Search tab — placeholder until a dedicated SearchScreen is built
export default function SearchTab() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.center}>
                <Text style={styles.text}>Search</Text>
                <Text style={styles.sub}>Coming soon…</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    text: { color: '#fff', fontSize: 24, fontWeight: '700' },
    sub: { color: '#666', marginTop: 8, fontSize: 14 },
});
