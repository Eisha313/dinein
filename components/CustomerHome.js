import { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Modal, Alert, ScrollView } from "react-native"
import { TextInput, Button } from "react-native-paper"
import { useTheme } from '@react-navigation/native';
import RestaurantCardList from './RestaurantCardList';
import FoodCardList from './FoodCardList'
import Filter from './Filter';
import firestore from '@react-native-firebase/firestore';
import SearchFoods from './SearchFoods';
import { useIsFocused } from "@react-navigation/native"; 
export default function CustomerHome({navigation}) {
    const isFocused = useIsFocused();
    const {colors} = useTheme()
    const [searchInput, setSearchInput] = useState('')
    const [modalShown, setModalShown] = useState(false)
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)
    const [size, setSize] = useState('small')
    const [stars, setStars] = useState(1)
    const [popularHotels, setPopularHotels] = useState([])
    const [popularFoods, setPopularFoods] = useState([])
    
    async function fetchPopularHotelsAndFoods() {
        try{
            const managers = await firestore().collection('Managers').limit(5).get()
            let collectionOutput = [] 
            managers.forEach(documentSnapshot => {
                collectionOutput.push(documentSnapshot.data().hotels)   //getting all hotel arrays
            });
            const hotels = []
            const foods = []
            collectionOutput.forEach((h) => {   
                h.forEach((tempHotel) => {
                    hotels.push(tempHotel)
                    tempHotel.foods.forEach((f) => {
                        f.hotelName = tempHotel.name
                        foods.push(f)
                    })
                })
            })
            setPopularHotels(hotels)
            setPopularFoods(foods)
        } catch (e) {
            Alert.alert(e.message)
        }
    }
    useEffect(() => {
        async function caller() {
            try{
                await fetchPopularHotelsAndFoods()
            } catch(e) {
                Alert.alert(e.message)
            }
        }
        caller()
    }, [isFocused])
    return (
        <View style={customerStyles.bodyContainer}>
            <View style={customerStyles.bodyInner}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalShown}
                    onRequestClose={() => {
                        setModalShown(!modalShown)
                    }}
                >
                    <Filter setSize={setSize} setStars={setStars} setMinPrice={setMinPrice} 
                    setMaxPrice={setMaxPrice} minPrice={minPrice} maxPrice={maxPrice} modalShown={modalShown} setModalShown={setModalShown} />
                </Modal>
                <View style={{width: '100%'}}>
                    <Text style={[{color: colors.primary, fontWeight: 'bold', fontSize: 30, width: '90%', fontFamily: "Poppins Black"}]}>What would you like to order</Text>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View style={{width: '80%'}}>
                            <TextInput style={[customerStyles.styledInput]} theme={{ roundness: 10 }} 
                                mode='outlined' label='Find for food or restaurant...'
                                outlineColor={'#808080'} 
                                activeOutlineColor={"#5a5a5a"}
                                value={searchInput} onChangeText={setSearchInput}
                            />
                        </View>
                        <View style={{marginLeft: 8}}>
                            <TouchableOpacity style={{backgroundColor: '#fff', borderRadius: 13, elevation: 10, 
                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 5}} onPress={() => {setModalShown(true)}}>
                                <Image style={{width: 18, height: 18, resizeMode: 'contain'}} source={require('../resources/images/filterIcon.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView style={{marginTop: 10}}>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -30, marginTop: 5}}>
                            <TouchableOpacity><Image style={{width: 80, height: 150, resizeMode: 'cover'}} source={require('../resources/images/categoryPic1.png')} /></TouchableOpacity>
                            <TouchableOpacity><Image style={{width: 80, height: 150, resizeMode: 'cover'}} source={require('../resources/images/categoryPic2.png')} /></TouchableOpacity>
                            <TouchableOpacity><Image style={{width: 80, height: 150, resizeMode: 'cover'}} source={require('../resources/images/categoryPic3.png')} /></TouchableOpacity>
                            <TouchableOpacity><Image style={{width: 80, height: 150, resizeMode: 'cover'}} source={require('../resources/images/categoryPic4.png')} /></TouchableOpacity>                                 
                        </View>
                        {searchInput.length === 0 ? <>
                        <View style={{marginTop: 16}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={[{color: '#323643', fontWeight: 'bold', fontSize: 18, marginBottom: 15}]}>Featured Restaurants</Text>
                                <TouchableOpacity><Text style={[{color: colors.primaryBackground, marginBottom: 16}]}>View More</Text></TouchableOpacity>
                            </View>
                            <View>
                                <RestaurantCardList hotels={popularHotels} navigation={navigation} />
                            </View>
                        </View>
                        <View style={{marginTop: 16}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={[{color: '#323643', fontWeight: 'bold', fontSize: 18, marginBottom: 15, marginTop: 10}]}>Popular Foods</Text>
                            </View>
                            <View>
                                <FoodCardList navigation={navigation} foods={popularFoods} />
                            </View>
                        </View>
                        </> : <><SearchFoods navigation={navigation} searchInput={searchInput} /></>
                        }
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}
const customerStyles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 70
    },
    bodyInner: {
        width: '90%',
        flexDirection: 'column',
        alignItems: 'center'
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