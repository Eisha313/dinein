import { React, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import firestore, { firebase } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import CustomActivityIndicator from '../components/CustomActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function FoodCard({ food, navigation, deleteFood, specificHotelName}) {
    const { colors } = useTheme();
    const [image, setImage] = useState(undefined);
    const [rating, setRating] = useState('');
    const [time, setTime] = useState('30');

    useEffect(() => {
        //Calculating food reviews
        let reviewCount = 0
        let totalStars = 0
        food.reviews.forEach(r => {
            totalStars += r.stars
            reviewCount++
        })
        //setting food reviews
        if (reviewCount === 0) setRating(0)
        else setRating(totalStars / reviewCount)

        storage()
            .ref(food.foodImage) //name in storage in firebase console
            .getDownloadURL()
            .then((url) => {
                setImage(url)
            })

    }, [])
    if (image === undefined) {
        return (
            <CustomActivityIndicator />
        )
      }

    return (
        <View style={foodListStyles.foodCard}>
            <Image
                source={{
                    uri: image,
                }}
                style={foodListStyles.foodCardPicture}
            />
            <Text
                style={{
                    color: colors.primary,
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginTop: 5,
                    marginLeft: 5,
                }}>
                {food.name}
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    justifyContent: 'space-between',
                    width: '100%',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                        source={require('../assets/images/timee.png')}
                        style={{ width: 16, height: 16, marginLeft: 3 }}
                    />
                    <Text
                        style={{
                            color: colors.secondaryBackground,
                            fontWeight: 'bold',
                            marginLeft: 3,
                            fontSize: 16,
                        }}>
                        {time}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', marginRight: 20 }}>
                    <Image
                        source={require('../assets/images/starrating.png')}
                        style={{ width: 16, height: 16 }}
                    />
                    <Text
                        style={{
                            color: colors.primary,
                            fontWeight: 'bold',
                            marginLeft: 1,
                            fontSize: 16,
                        }}>
                        {rating} / 5
                    </Text>
                </View>
            </View>
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    marginTop: 5,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        color: colors.primaryBackground,
                        fontWeight: 'bold',
                        fontSize: 18,
                        marginLeft: 5,
                    }}>
                    {food.price} Rs.
                </Text>
                <View style={foodListStyles.screenBtns}>
                    <TouchableOpacity onPress={() => navigation.navigate('View Food', {food: food, rating: rating, time: time, image: image})}>
                        <View style={foodListStyles.viewBtn}>
                            <Image source={require('../assets/images/eye.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Add Food', {food: food, specificHotelName, name: food.name})
                        }}>
                        <View style={foodListStyles.editBtn}>
                            <Image
                                source={require('../assets/images/edit.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteFood(food.name, specificHotelName)}>
                        <View style={foodListStyles.deleteBtn}>
                            <Image
                                source={require('../assets/images/Delete.png')}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const foodListStyles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },

    screenView: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '95%',
    },

    searchView: {
        width: '100%',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    searchButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 52,
        marginTop: 4.5,
    },

    categoriesView: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
    },

    foodsView: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 5,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    foodCard: {
        width: '50%',
        flexDirection: 'column',
        marginTop: 10,
        paddingBottom: 10,
        borderColor: '#41179F',
        borderWidth: 1,
        borderRadius:15,
    },

    foodCardPicture: {
        width: '100%',
        height: 100,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },

    deleteBtn: {
        width: 24,
        height: 24,
        backgroundColor: '#D1141B',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },

    editBtn: {
        width: 24,
        height: 24,
        backgroundColor: '#38C74F',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },

    viewBtn: {
        width: 24,
        height: 24,
        backgroundColor: '#0EC0A0',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },

    screenBtns: {
        flexDirection: 'row',
        marginRight: 10,
    },

    addButton: {
        marginTop: 10,
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: '48%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
});