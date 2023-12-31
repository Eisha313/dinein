import { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Modal } from "react-native"
import { TextInput, Button } from "react-native-paper"
import { useTheme } from '@react-navigation/native';
import RestaurantCardList from './RestaurantCardList';
import FoodCardList from './FoodCardList'
import Filter from './Filter';
import firestore from '@react-native-firebase/firestore';

export default function SearchFoods({navigation, searchInput}) {
    const {colors} = useTheme()
    const [foods, setFoods] = useState([])
    async function fetchSearchedFoods() {
        try{
            const managers = await firestore().collection('Managers').get()
            let collectionOutput = [] 
            managers.forEach(documentSnapshot => {
                collectionOutput.push(documentSnapshot.data().hotels)
            });
            const hotels = []
            const tempFoods = []
            collectionOutput.forEach((h) => {
                h.forEach((tempHotel) => {
                    hotels.push(tempHotel)
                    tempHotel.foods.forEach((f) => {
                        f.hotelName = tempHotel.name
                        tempFoods.push(f)
                    })
                })
            })
            setFoods(tempFoods.filter(f => {
                return f.name.toLowerCase().includes(searchInput.toLowerCase())
            }))
            console.log(tempFoods)
        } catch (e) {
            Alert.alert(e)
        }
    }
    useEffect(() => {
        if (searchInput.length === 0) return
        fetchSearchedFoods()       
    }, [searchInput])

    return (
                <View style={{marginTop: 16, width: '100%'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={[{color: colors.primary, fontWeight: 'bold', fontSize: 20}]}>Results for {searchInput}</Text>
                        </View>
                        <View style={{marginTop: 16}}>
                            <FoodCardList navigation={navigation} foods={foods} />
                        </View>
                </View>
    )
}

const customerStyles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    bodyInner: {
        width: '85%',
        flexDirection: 'column',
    },
    bodyHeadingMain: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    container: {
        marginBottom: 48
    },
    primaryButton: {
        borderRadius: 50,
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 32
    },
    primaryButtonText: {
        fontSize: 16,
    },
    styledInput: {
      borderRadius: 10
    }
})