import {View, ScrollView} from 'react-native'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'
import FoodCard from './FoodCard'
import uuid from 'react-native-uuid';

export default function FoodCardList({navigation, foods}) {
    return (
        <ScrollView contentContainerStyle={{paddingBottom: 100000}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {
                    foods.map(f => {
                        return (
                            <FoodCard key={uuid.v4()} food={f} navigation={navigation} />
                        )
                    })
                }
            </View>
        </ScrollView>
    )
}
