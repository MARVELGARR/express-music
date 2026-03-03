



import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { categoryTags } from "./constants"
import { useTheme } from "@react-navigation/native"
import { useColorScheme } from "nativewind"
import { Moon } from "lucide-react-native"




export const Cartegory = () => {

    const { } = useTheme()
    const { toggleColorScheme } = useColorScheme()

    return (
        <ScrollView horizontal showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={toggleColorScheme} >
                <Moon />
            </TouchableOpacity>
            <View className="bg-background text-foreground flex flex-row gap-5" >

                {categoryTags.map((items) => {
                    return (
                        <Text className="bg-background text-foreground">{items.name}</Text>


                    )
                })}
            </View>
        </ScrollView>
    )
}


