import {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import {useTheme} from '@react-navigation/native';
import storage from '@react-native-firebase/storage'
import CustomActivityIndicator from './CustomActivityIndicator';
export default function CartOrderCard({food, getCart, deleteCartItem}) {
  const {colors} = useTheme();
  const [foodImage, setFoodImage] = useState(undefined)
  useEffect(() => {
    storage()
      .ref(food.foodImage) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setFoodImage(url);
      });
  }, [])
  if (foodImage === undefined) {
    return (
        <CustomActivityIndicator />
    )
}
  return (
    <View>
      <View
        style={[styles.container, {borderColor: colors.secondaryBackground}]}>
        <View style={styles.orderno}>
          <Image style={styles.imageStyle} source={{uri: foodImage}}></Image>
          <View style={styles.items}>
            <Text style={[styles.restFont, {color: colors.primary}]}>
              {food.name}
            </Text>
            <Text
              style={[styles.itemFont, {color: colors.secondaryBackground}]}>
              Quantity x{food.quantity}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: colors.primaryBackground,
              }}>
              Rs. {food.price} + {food.fee}(Delivery fee)
            </Text>
          </View>
          <View style={styles.price}>
          <TouchableOpacity onPress={() => {
            deleteCartItem(food.id)            
          }}>
          <Image
                source={require('../resources/images/delete.png')}
                style={{width: 25, height: 25, marginRight: 10}}></Image>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 10,
    marginRight: 20,
    marginLeft: 20,
    borderWidth: 2,
    borderRadius: 20,
  },
  imageStyle: {
    height: 80,
    width: 80,
    borderRadius: 22,
  },
  orderno: {
    flexDirection: 'row',
  },
  price: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
  },
  items: {
    justifyContent: 'space-evenly',
    marginLeft: 10,
  },
  pricetext: {
    fontSize: 16,
  },
  itemFont: {
    fontSize: 14,
  },
  restFont: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
