import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Cartegory } from '@/features/home/category'

const HomeScreen = () => {
    return (
        <View>
            <Text>HomeScreen</Text>
            <Cartegory />
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})