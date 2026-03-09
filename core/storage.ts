/**
 * Storage — Persistence helper for Favourites and Play Counts.
 * Uses AsyncStorage to keep track of user interactions.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVS_KEY = 'express_music_favourites';
const PLAY_COUNTS_KEY = 'express_music_play_counts';

export const storage = {
    // Favourites
    async toggleFavourite(songUri: string): Promise<boolean> {
        const favs = await this.getFavourites();
        const index = favs.indexOf(songUri);
        if (index > -1) {
            favs.splice(index, 1);
            await AsyncStorage.setItem(FAVS_KEY, JSON.stringify(favs));
            return false;
        } else {
            favs.push(songUri);
            await AsyncStorage.setItem(FAVS_KEY, JSON.stringify(favs));
            return true;
        }
    },

    async getFavourites(): Promise<string[]> {
        const value = await AsyncStorage.getItem(FAVS_KEY);
        return value ? JSON.parse(value) : [];
    },

    async isFavourite(songUri: string): Promise<boolean> {
        const favs = await this.getFavourites();
        return favs.includes(songUri);
    },

    // Play Counts
    async incrementPlayCount(songUri: string): Promise<void> {
        const counts = await this.getPlayCounts();
        counts[songUri] = (counts[songUri] || 0) + 1;
        await AsyncStorage.setItem(PLAY_COUNTS_KEY, JSON.stringify(counts));
    },

    async getPlayCounts(): Promise<Record<string, number>> {
        const value = await AsyncStorage.getItem(PLAY_COUNTS_KEY);
        return value ? JSON.parse(value) : {};
    },
};
