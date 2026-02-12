
import React, { useState } from "react"
import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { s, vs } from "react-native-size-matters"

const TabItems = [
    { name: "Songs" },
    { name: "Albums" },
    { name: "Artists" },
    { name: "Playlists" },
]

export const LibraryTab = () => {
    const [activeTab, setActiveTab] = useState("Songs")

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {TabItems.map((tab) => {
                    const isActive = activeTab === tab.name
                    return (
                        <TouchableOpacity
                            key={tab.name}
                            onPress={() => setActiveTab(tab.name)}
                            style={[
                                styles.tabButton,
                                isActive && styles.activeTabButton
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.tabText,
                                isActive && styles.activeTabText
                            ]}>
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: vs(12),
    },
    scrollContent: {
        paddingHorizontal: s(16),
    },
    tabButton: {
        paddingHorizontal: s(16),
        paddingVertical: vs(6),
        borderRadius: s(20),
        marginRight: s(8),
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    activeTabButton: {
        backgroundColor: '#fff', // Or use a theme color if available
        borderColor: '#fff',
    },
    tabText: {
        fontSize: s(13),
        fontWeight: '500',
        color: 'rgba(255,255,255,0.6)',
    },
    activeTabText: {
        color: '#000',
    },
})