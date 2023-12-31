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
              style={{color: colors.primary, fontWeight: 'bold', fontSize: 24}}>
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
              <Text style={{color: colors.primaryBackground, fontSize: 24}}>
                {'Rs. ' + food.price}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primaryBackground,
                  width: 50,
                  height: 50,
                  borderRadius: 100,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => updateCount(-1)}>
                <Text style={{color: colors.primaryText, fontSize: 24}}>-</Text>
              </TouchableOpacity>
              <Text style={{color: colors.primary, fontSize: 24}}>
                {' '}
                {buyCount}{' '}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primaryBackground,
                  width: 50,
                  height: 50,
                  borderRadius: 100,
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
            <Text style={{color: colors.primary}}>{food.description}</Text>
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
              <TouchableOpacity
                style={{
                  backgroundColor: colors.secondaryBackground,
                  paddingTop: 4,
                  paddingBottom: 4,
                  paddingLeft: 16,
                  paddingRight: 16,
                  borderRadius: 15,
                }}
                onPress={() => {
                  addFoodToCart();
                  navigation.navigate('Customer Home')
                }}>
                <Image
                  style={{width: 30, height: 30}}
                  source={require('../resources/images/cartIconProduct.png')}
                />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.secondaryBackground,
                  paddingTop: 4,
                  paddingBottom: 4,
                  paddingLeft: 16,
                  paddingRight: 16,
                  borderRadius: 15,
                }} onPress={() => {
                  addFoodToWishlist()
                }}>
                <Image
                  style={{width: 30, height: 30}}
                  source={require('../resources/images/favoriteIconProduct.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              borderBottomWidth: 1,
              borderBottomColor: colors.primaryBackground,
            }}>
            <Text
              style={{color: colors.primary, fontWeight: 'bold', fontSize: 16}}>
              Details
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text style={{color: colors.primary}}>Offered By</Text>
              <Text
                style={{
                  color: colors.primaryBackground,
                  textDecorationLine: 'underline',
                }}>
                {food.hotelName}
              </Text>
            </View>
            <View>
              <TouchableOpacity>
                <Text
                  style={{
                    color: colors.primaryBackground,
                    textDecorationLine: 'underline',
                  }}>
                  Chat Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text style={{color: colors.primary}}>{'Size: ' + food.size}</Text>
            </View>
            <View>
              <Text style={{color: colors.primary}}>
                {'Catgeory: ' + food.category}
              </Text>
            </View>
          </View>
          <View style={{width: '100%'}}>
            <Text style={{color: colors.primary, fontWeight: 'bold'}}>
              Delievery Fee
            </Text>
            <Text style={{color: colors.primaryBackground}}>
              {'Rs. ' + food.fee}
            </Text>
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
