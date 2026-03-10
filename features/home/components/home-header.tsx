import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo } from 'react'
import { useThemeColors } from '../hooks/useThemeColors';
import { useRouter } from 'expo-router';
import { s, vs } from 'react-native-size-matters';
import { Moon, Music, Search, Sun } from 'lucide-react-native';

const HomeHeader = () => {
    const { colors, isDark, toggleColorScheme } = useThemeColors();
    const router = useRouter();

    // Greeting based on time of day
    const greeting = useMemo(() => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 18) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <View
                    style={[
                        styles.logoCircle,
                        { backgroundColor: colors.accent },
                    ]}
                >
                    <Music size={s(14)} color={colors.textInverted} />
                </View>
                <View>
                    <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                        {greeting}
                    </Text>
                    <Text style={[styles.appName, { color: colors.text }]}>
                        Express Music
                    </Text>
                </View>
            </View>

            <View style={styles.headerRight}>
                {/* Search */}
                <TouchableOpacity
                    onPress={() => router.push('/search')}
                    activeOpacity={0.6}
                    style={[
                        styles.iconBtn,
                        { backgroundColor: colors.accentSoft },
                    ]}
                >
                    <Search size={s(18)} color={colors.icon} />
                </TouchableOpacity>

                {/* Dark / Light toggle — easy to reach */}
                <TouchableOpacity
                    onPress={toggleColorScheme}
                    activeOpacity={0.6}
                    style={[
                        styles.iconBtn,
                        { backgroundColor: colors.accentSoft },
                    ]}
                >
                    {isDark ? (
                        <Sun size={s(18)} color={colors.icon} />
                    ) : (
                        <Moon size={s(18)} color={colors.icon} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HomeHeader

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: s(16),
        paddingVertical: vs(12),
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(10),
    },
    logoCircle: {
        width: s(36),
        height: s(36),
        borderRadius: s(18),
        justifyContent: 'center',
        alignItems: 'center',
    },
    greeting: {
        fontSize: s(11),
        fontWeight: '500',
    },
    appName: {
        fontSize: s(18),
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(8),
    },
    iconBtn: {
        width: s(38),
        height: s(38),
        borderRadius: s(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
})