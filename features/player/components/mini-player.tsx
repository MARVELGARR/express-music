import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Play, Pause, SkipForward, Music2 } from 'lucide-react-native';
import { s, vs } from 'react-native-size-matters';
import { usePlayer } from '../hooks/usePlayer';

export const MiniPlayer = () => {
    const { currentSong, isPlaying, togglePlayback, next } = usePlayer();

    if (!currentSong) return null;

    return (
        <View style={styles.container}>
            {/* Artwork */}
            <View style={styles.artworkContainer}>
                {currentSong.imageUri ? (
                    <Image
                        source={{ uri: currentSong.imageUri }}
                        style={styles.artwork}
                    />
                ) : (
                    <View style={styles.artworkPlaceholder}>
                        <Music2 size={s(16)} color="#888" />
                    </View>
                )}
            </View>

            {/* Song Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>
                    {currentSong.title}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                    {currentSong.artist}
                </Text>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                <TouchableOpacity
                    onPress={togglePlayback}
                    style={styles.controlButton}
                    activeOpacity={0.7}
                >
                    {isPlaying ? (
                        <Pause size={s(20)} color="white" fill="white" />
                    ) : (
                        <Play size={s(20)} color="white" fill="white" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={next}
                    style={styles.controlButton}
                    activeOpacity={0.7}
                >
                    <SkipForward size={s(18)} color="white" fill="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1c1c1e',
        paddingHorizontal: s(12),
        paddingVertical: vs(8),
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
        marginHorizontal: s(8),
        marginBottom: vs(4),
        borderRadius: s(12),
        position: "absolute",
        bottom: 110,
    },
    artworkContainer: {
        marginRight: s(12),
    },
    artwork: {
        width: s(40),
        height: s(40),
        borderRadius: s(8),
    },
    artworkPlaceholder: {
        width: s(40),
        height: s(40),
        borderRadius: s(8),
        backgroundColor: '#2c2c2e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
        marginRight: s(8),
    },
    title: {
        color: 'white',
        fontSize: s(14),
        fontWeight: '600',
    },
    artist: {
        color: '#999',
        fontSize: s(12),
        marginTop: vs(2),
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(8),
    },
    controlButton: {
        padding: s(8),
    },
});
