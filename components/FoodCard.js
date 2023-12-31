import {View, Image, Text, TouchableOpacity} from 'react-native'
import { useTheme } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import storage from '@react-native-firebase/storage'
import CustomActivityIndicator from './CustomActivityIndicator';
export default function FoodCard({food, navigation}) {
    const {colors} = useTheme()
    const [foodImage, setFoodImage] = useState(undefined)
    const [rating, setRating] = useState(0)
    const [totalReviews, setTotalReviews] = useState(0)
    useEffect(() => {
        //getting hotel reviews
        let reviewCount = 0
        let totalStars = 0
        const reviews = []
        food.reviews.forEach(r => {
            totalStars += r.stars
            reviewCount++
        })
        if (reviewCount === 0) setRating(0)
        else {
            setRating(Math.round((totalStars / reviewCount) * 10) / 10)
        }
        setTotalReviews(reviewCount)
        //download image from firebase storage
        storage()
      .ref(food.foodImage) //name in storage in firebase console
      .getDownloadURL()
      .then((url) => {
        setFoodImage(url);
      })
    }, [])
    if (foodImage === undefined) {
        return (
            <CustomActivityIndicator />
        )
    }
    return (
        <TouchableOpacity style={{borderColor: colors.border, borderRadius: 15, borderWidth: 1, width: '48%', flexWrap: 'wrap', marginBottom: 16}}
        onPress={() => {navigation.navigate('View Food', food)}}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Image style={{ height: 100,
                borderTopLeftRadius: 15, borderTopRightRadius: 15, width: '100%'}} source={{uri: foodImage}} />
            </View>
            <View style={{marginLeft: 16}}>
                <Text style={{color: colors.primary, fontSize: 20, fontWeight: 'bold', marginTop: 4, marginBottom: 1}}>{food.name}</Text>
                <Text style={{color: colors.primaryBackground, fontSize: 16,  marginBottom: 2}}>{'Rs. ' + food.price}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: colors.primary}}>{rating} </Text>
                    <Image style={{width: 10, height: 10,}} source={require('../resources/images/starIcon.png')} />
                    <Text style={{color: colors.primary}}> {'(' + totalReviews +')'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}