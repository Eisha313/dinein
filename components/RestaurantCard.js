import {View, Image, Text, TouchableOpacity, ActivityIndicator} from 'react-native'
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import storage from '@react-native-firebase/storage'
import CustomActivityIndicator from './CustomActivityIndicator';
import uuid from 'react-native-uuid';

export default function RestaurantCard({restaurant, navigation}) {
    const {colors} = useTheme()
    const [categories, setCategories] = useState([])
    const [rating, setRating] = useState(0)
    const [totalReviews, setTotalReviews] = useState(0)
    const [hotelImage, setHotelImage] = useState(undefined)
    useEffect(() => {
        //getting hotel categories
        const categoriesTemp = []
        let count = 0
        restaurant.foods.forEach(f => {
            if (count < 3) {
                categoriesTemp.push(f.category)
            }
            count++
        })
        setCategories([...new Set(categoriesTemp)])
        //getting hotel reviews
        let reviewCount = 0
        let totalStars = 0
        const reviews = []
        restaurant.foods.forEach(f => {
            f.reviews.forEach(r => {
                totalStars += r.stars
                reviewCount++
            })
        })
        if (reviewCount === 0) setRating(0)
        else {
            setRating(Math.round((totalStars / reviewCount) * 10) / 10)
        }
        setTotalReviews(reviewCount)
        //download image from firebase storage
        storage()
      .ref(restaurant.hotelImage) //name in storage in firebase console
      .getDownloadURL()
      .then((url) => {
        setHotelImage(url);
      })

    }, [])
    if (hotelImage === undefined) {
        return (
            <CustomActivityIndicator />
        )
    }
    return (
        <TouchableOpacity style={{ borderColor: '#a8a8a8',borderRadius: 7, borderWidth: 0.2, width: 250, marginRight: 10, backgroundColor: '#fff'}} onPress={() => {
            navigation.navigate('View Hotel Foods', restaurant.name)
        }}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Image style={{ height: 100,
                borderTopLeftRadius: 15, borderTopRightRadius: 15, width: 250}} source={{uri: hotelImage}} 
                />
            </View>
            <View style={{marginLeft: 16, paddingBottom: 10}}>
                <Text style={{color: colors.primary, fontSize: 20, fontWeight: 'bold', marginTop: 4, marginBottom: 4}}>{restaurant.name}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: '#8A8E9B'}}>{rating} </Text>
                    <Image style={{width: 10, height: 10,}} source={require('../resources/images/starIcon.png')} />
                    <Text style={{color: '#8A8E9B'}}> {'(' + totalReviews +')'}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 4, marginBottom: 4}}>
                    {
                        categories.map((r, i) => {
                            return (
                                <Text key={uuid.v4()} style={{color: '#8A8E9B', backgroundColor: '#f6f6f6',
                                borderRadius: 5, marginRight: 10, padding: 5, paddingHorizontal: 15}}>{r}</Text>
                            )
                        })
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}