


import { StyleSheet, Text, View } from 'react-native'

import { ForYouCategory } from './ActiveTabs/fory-you';
import AlbumCategory from './ActiveTabs/album';
import SongsCategory from './ActiveTabs/songs';
import ArtistCategory from './ActiveTabs/artist';




const ActiveTabs = ({ activeTab }: { activeTab: string }) => {



    switch (activeTab) {
        case "For You":
            return <ForYouCategory />
        case "Songs":
            return <SongsCategory />

        case "Album":
            return <AlbumCategory />
        case "Artists":
            return <ArtistCategory />
        default:
            break;
    }

}

export default ActiveTabs

const styles = StyleSheet.create({})