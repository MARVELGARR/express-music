/**
 * Home feature constants — category filter pills & quick-action data.
 */

export const categoryTags = [
    { name: 'All', icon: 'music' },
    { name: 'Recently Played', icon: 'clock' },
    { name: 'Most Played', icon: 'trending-up' },
    { name: 'Favourites', icon: 'heart' },
    { name: 'Albums', icon: 'disc' },
    { name: 'Artists', icon: 'mic-2' },
    { name: 'Folders', icon: 'folder' },
] as const;

export type CategoryTag = (typeof categoryTags)[number];

/**
 * Quick-action cards shown on the home hero section.
 */
export const quickActions = [
    { id: 'shuffle', label: 'Shuffle All', icon: 'shuffle' },
    { id: 'recent', label: 'Recently Added', icon: 'clock' },
    { id: 'favourites', label: 'Favourites', icon: 'heart' },
    { id: 'most-played', label: 'Most Played', icon: 'bar-chart-2' },
] as const;