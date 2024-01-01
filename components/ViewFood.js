import {View, StyleSheet, Text, Image, TouchableOpacity, Alert, ScrollView} from 'react-native';
import {Button} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {useState, useEffect} from 'react';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/firestore';
import CustomActivityIndicator from './CustomActivityIndicator';
export default function ViewFood({route, navigation}) {
  const {colors} = useTheme();
  const food = route.params;
  const [buyCount, setBuyCount] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleRadioButtonPress = (value) => {
    setSelectedOption(value);
  };

  const options = [
    { id: 1, title: 'Pepper  Julienned', imageSource: require('../resources/images/radio1.png') },
    { id: 2, title: 'Baby Spinach', imageSource: require('../resources/images/radio2.png') },
    { id: 3, title: 'Masroom', imageSource: require('../resources/images/radio3.png') },
  ];

  function updateCount(value) {
    if (buyCount + value < 1) return;
    setBuyCount(buyCount + value);
  }
  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }
  const [foodImage, setFoodImage] = useState(undefined);
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  async function addFoodToWishlist() {
    const customers =  firestore().collection('Customers') 
    try{
      const user = await getSessionUser()
      const customerData = await customers.doc(user.id)
      const data = await customerData.update({
        wishlist: firebase.firestore.FieldValue.arrayUnion(food)
      })
      Alert.alert('Added to Wishlist!')
    } catch(e) {
      console.log(e)
    }
  }
  useEffect(() => {
    //getting hotel reviews
    let reviewCount = 0;
    let totalStars = 0;
    food.reviews.forEach(r => {
      totalStars += r.stars;
      reviewCount++;
    });
    if (reviewCount === 0) setRating(0);
    else {
      setRating(Math.round((totalStars / reviewCount) * 10) / 10)
  }
    setTotalReviews(reviewCount);
    //download image from firebase storage
    storage()
      .ref(food.foodImage) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setFoodImage(url);
      });
  }, []);
  if (foodImage === undefined) {
    return (
        <CustomActivityIndicator />
    )
  }
  async function addFoodToCart() {
    food.quantity = buyCount
    food.price = food.price * buyCount
    food.id = Math.random().toString()
    try {
      const value = await AsyncStorage.getItem('cart');
      if (value === null) {
        //key for uniquely identifying each car
        await AsyncStorage.setItem(
          'cart',
          JSON.stringify([food]),
        );
      } else {
        //if array already exists in storage then modifying it
        const tempArray = JSON.parse(value);
        tempArray.push(food);
        await AsyncStorage.setItem('cart', JSON.stringify(tempArray));
      }
      Alert.alert('Food added to cart!');
    } catch (e) {
      Alert.alert('An error occurred');
    }
  }
  return (
    <ScrollView>
      
      <View
        style={[
          customerStyles.bodyContainer,
          {backgroundColor: colors.background},
        ]}>
        <View style={customerStyles.bodyInner}>
          
          <View style={{width: '100%', marginTop: 20, marginBottom: 16}}>
            <TouchableOpacity onPress={() => { addFoodToWishlist() }} style={{ height: 35, width: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 10, bottom: 10, zIndex: 1, elevation: 10, backgroundColor: colors.secondaryBackground }}>
              <Image source={require('../resources/images/fav.png')} />
            </TouchableOpacity>
            <Image
              style={{
                height: 200,
                width: '100%',
                resizeMode: 'stretch',
                borderRadius: 10,
              }}
              source={{uri: foodImage}}
            />
          </View>
          <View style={{width: '100%', marginBottom: 8}}>
            <Text
              style={{color: '#323643', fontWeight: 'bold', fontSize: 28}}>
              {food.name}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
            <Image
              style={{width: 20, height: 20}}
              source={require('../resources/images/starIcon.png')}
            />
            <Text style={{color: colors.primary, fontWeight: 'bold'}}>
              {' '}
              {rating}{' '}
            </Text>
            <Text style={{color: colors.secondaryBackground}}>
              {' '}
              {'(' + totalReviews + ')  '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Reviews', food)}>
              <Text
                style={{
                  color: colors.primaryBackground,
                  textDecorationLine: 'underline',
                }}>
                See Reviews
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
            <View>
              <Text style={{color: colors.primaryBackground, fontSize: 24, fontWeight: 'bold'}}>
                {'Rs. ' + food.price}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: colors.primaryBackground,
                  width: 35,
                  height: 35,
                  borderRadius: 20,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => updateCount(-1)}>
                <Text style={{color: colors.primaryBackground, fontSize: 24}}>-</Text>
              </TouchableOpacity>
              <Text style={{color: colors.primary, fontWeight: "bold", fontSize: 16, marginHorizontal: 6}}>
                {' '}
                {buyCount.toString().padStart(2, '0')}{' '}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primaryBackground,
                  width: 35,
                  height: 35,
                  borderRadius: 20,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => updateCount(1)}>
                <Text style={{color: colors.primaryText, fontSize: 24}}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
            <Text style={{color: '#858992', fontSize: 15, lineHeight : 23.55, textAlign: 'justify', marginVertical: 5}}>{food.description}</Text>
          </View>          
          <View style={{alignItems: 'flex-start', width: '100%', marginVertical: 5}}>
              <Text style={{color: '#323643', fontSize: 18, fontWeight: 'bold'}}>Choice of Add On</Text>
              {options.map((option) => (
              <View key={option.id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <Image source={option.imageSource} style={{ width: 40, height: 40, marginRight: 10 }} />
                <Text style={{ flex: 1, color: '#000'}}>{option.title}</Text>
                <Text style={{ flex: 1, color: '#000' , textAlign: 'right', marginRight: 5}}>+ Rs. 0</Text>
                <TouchableOpacity
                  style={{
                    width: 25,
                    height: 25,
                    borderWidth: 2,
                    borderRadius: 15,
                    borderColor: colors.primaryBackground,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => handleRadioButtonPress(option.id)}
                >
                  {selectedOption === option.id && (
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: colors.primaryBackground,
                      }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 20,
              marginBottom: 8,
            }}>
            <View style={{width: '100%'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.secondaryBackground,
                  borderRadius: 50,
                  flexDirection: 'row',
                  height: 53,
                  width: 167,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center'
                }}
                onPress={() => {
                  addFoodToCart();
                  navigation.navigate('Customer Home')
                }}>
                <View style={{backgroundColor: '#fff', width: 40, height: 40, borderRadius: 20, resizeMode: 'contain', justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    source={require('../resources/images/bottomOrders.png')}
                  />
                </View>
                <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold', marginHorizontal: 10}}>ADD TO CART</Text>
              </TouchableOpacity>
              <View>
              
            </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const customerStyles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bodyInner: {
    width: '85%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  bodyHeadingMain: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  container: {
    marginBottom: 48,
  },
  primaryButton: {
    borderRadius: 50,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 32,
  },
  primaryButtonText: {
    fontSize: 20,
  },
});
