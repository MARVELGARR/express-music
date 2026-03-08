



import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { categoryTags } from "./constants"
import { useTheme } from "@react-navigation/native"

import { s, vs } from "react-native-size-matters"
import { useState } from "react"




export const Cartegory = () => {

    const [selectedCategory, setSelectedCategory] = useState("")


    const { dark } = useTheme()





    return (
        <ScrollView horizontal showsVerticalScrollIndicator={false}>

            <View className="">


                <View className="" style={styles.categoryContainer} >

                    {categoryTags.map((items, index) => {
                        return (
                            <Pressable onPress={() => setSelectedCategory(items.name)} key={index} >
                                <View className="" style={[{ borderWidth: 2, borderColor: dark ? "white" : "black" }, styles.CartegoryTags]}>
                                    <Text className="text-foreground ">{items.name}</Text>
                                </View>
                            </Pressable>


                        )
                    })}
                </View>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    categoryContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        padding: 5,
    },
    CartegoryTags: {
        borderWidth: 1,
        padding: 6,
        borderRadius: 10,
    }

})
