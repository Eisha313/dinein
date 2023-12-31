import {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import uuid from 'react-native-uuid';
import {useTheme} from '@react-navigation/native';
import CartOrderCard from './CartOrderCard';
import OrderSummaryCart from './OrderSummaryCart'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native"; 
import { firebase } from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore'
import CustomActivityIndicator from './CustomActivityIndicator';
export default function Cart({route, navigation}) {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const {colors} = useTheme();
  const isFocused = useIsFocused();
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalFee, setTotalFee] = useState(0)
  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }
  async function getCart() {
    let val = undefined
    try{
       val = await AsyncStorage.getItem('cart')
    } catch(e) {
      console.log(e)
    }
    if (val === null) {
      return
    }
    const cart = JSON.parse(val)
    console.log(cart[0])
    setCartItems([...cart])
    //updating total price and fee
    let total = 0
    let fee = 0
    cart.forEach(item => {
      total += item.price
      fee += item.fee
    })
    setTotalPrice(total)
    setTotalFee(fee)
  }
  async function deleteCart() {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify([]))
      getCart()
    } catch(e) {
      console.log(e)
    }
  }
  async function deleteCartItem(id) {
    let val = undefined
    try{
      val = await AsyncStorage.getItem('cart')
    } catch(e) {
      console.log(e)
    }
    if (val === null) {
      Alert.alert('No items in cart')
      return
    }
    const cart = JSON.parse(val)
    const newCart = cart.filter(f => {
      return f.id !== id
    })
    try{
      await AsyncStorage.setItem('cart', JSON.stringify(newCart))
    } catch(e){
      console.log(e)
    }
    setCartItems([...newCart])
  }
  async function createOrder() {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty')
      return
    }
    setIsFormSubmitting(true)
    //creating order
    const foods = []
    cartItems.forEach((item) => {
      const food = {
        foodName: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        image: item.foodImage
      }
      foods.push(food)
    })
    let date = new Date();
    let newDateObj = new Date(date.getTime() + 30*60000);
    const order = {
      orderNo: Math.floor((Math.random() * 10000)).toString(),
      orderDate: new Date().toLocaleString(),
      deliveryDate: newDateObj.toLocaleString(),
      foods: foods,
      isActive: true
    }
    //saving order in database
    const customers =  firestore().collection('Customers') 
    try{
      const user = await getSessionUser()
      const customerData = customers.doc(user.id)
      const data = await customerData.update({
        orders: firebase.firestore.FieldValue.arrayUnion(order)
      })
      setIsFormSubmitting(false)
      Alert.alert('Order successfully created!')
      deleteCart()
      navigation.navigate('Customer Home')
    } catch(e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getCart()
  }, [isFocused])


  return (
    <ScrollView>
      <View>
        <View style={{margin: 20}}>
          <Text
            style={{fontWeight: 'bold', fontSize: 20, color: colors.primary}}>
            CART
          </Text>
        </View>
        <View>
          {cartItems.map(food => {
            return (
              <CartOrderCard key={uuid.v4()}
                food={food} getCart={getCart} deleteCartItem={deleteCartItem}
                navigation={navigation}></CartOrderCard>
            );
          })}
        </View>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              deleteCart()
              navigation.navigate('Customer Home');
              navigation.navigate('Cart')
            }}
            style={{
              borderWidth: 2,
              borderRadius: 20,
              alignItems: 'center',
              width: '60%',
              padding: 12,
              marginTop: 30,
              borderColor: colors.card,
              backgroundColor: colors.card,
            }}>
            <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../resources/images/remove_shopping_cart.png')}
                  style={{width: 25, height: 25, marginRight: 10}}></Image>
              <Text style={{color: colors.background}}> Empty Cart </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <OrderSummaryCart totalPrice={totalPrice} totalFee={totalFee} style={{backgroundColor: colors.card}}></OrderSummaryCart>
        </View>
        <View style={{alignItems: 'center'}}>
        {
                    !isFormSubmitting ?
                    <TouchableOpacity
                    onPress={() => {
                      createOrder()
                    }}
                    style={{
                      borderWidth: 2,
                      borderRadius: 20,
                      alignItems: 'center',
                      width: '60%',
                      padding: 12,
                      marginTop: 2,
                      borderColor: colors.card,
                      backgroundColor: colors.card,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                        <Image
                          source={require('../resources/images/done.png')}
                          style={{width: 25, height: 25, marginRight: 10}}></Image>
                      <Text style={{color: colors.background}}> CHECKOUT </Text>
                    </View>
                  </TouchableOpacity>
                    : <CustomActivityIndicator />
                }
          
        </View>
      </View>
    </ScrollView>
  );
}
