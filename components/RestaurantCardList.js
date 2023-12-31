import {View, ScrollView} from 'react-native'
import RestaurantCard from "./RestaurantCard"
import uuid from 'react-native-uuid';

export default function RestaurantCardList({hotels, navigation}) {
    return (
        <View style={{flexDirection: 'row',  }}>
            <ScrollView horizontal>
            {
                hotels.map(r => {
                    return (
                        <RestaurantCard key={uuid.v4()} restaurant={r} navigation={navigation} />
                    )
                })
            }
            </ScrollView>
        </View>
    )
}
