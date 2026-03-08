import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Cartegory } from '@/features/home/category'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Moon, Search } from 'lucide-react-native'
import { s, vs } from 'react-native-size-matters'
import { useColorScheme } from 'nativewind'
import { useRoute, useTheme } from '@react-navigation/native'
import { useRouter } from 'expo-router'


const HomeScreen = () => {
    const { toggleColorScheme } = useColorScheme()
    const { dark } = useTheme()
    const router = useRouter()
    return (
        <SafeAreaView>
            <View className='' >

                <View style={styles.Header}>
                    <View className='flex flex-row ' style={{ gap: 10 }}>

                        <Text className='text-foreground'>Home</Text>
                        <Search color={dark ? "white" : "black"} className='text-foreground bg-background' onPress={() => router.push("/search")} size={17} />
                    </View>
                    <View className=''>

                        <TouchableOpacity onPress={toggleColorScheme} >
                            <Moon style={{ backgroundColor: "white" }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>

                    <Cartegory />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({

    Header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: s(15),
        paddingVertical: vs(4)
    }
})