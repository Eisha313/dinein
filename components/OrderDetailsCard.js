import React, {useEffect, useState} from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import CustomActivityIndicator from './CustomActivityIndicator';
export default function OrderDetailsCard({food}) {
  const { colors } = useTheme();
  const [img, setImg] = useState();
    
  useEffect(() => {
    storage()
      .ref(food.image) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setImg(url);
      });
    
  }, []);
  if (img === undefined) {
    return (
        <CustomActivityIndicator />
    )
}
  return (
    <View>
      <TouchableOpacity
        style={[styles.container, { borderColor: colors.secondaryBackground}]}>
        <View style={styles.orderno}>
          <Image
            style={styles.imageStyle}
            source={{ uri: img }}></Image>
          <View style={styles.items}>
            <Text style={[styles.itemFont,{color:colors.primary}]}>Quantity x{food.quantity}</Text>
            <Text style={[styles.restFont,{color:colors.primary}]}>{food.foodName}</Text>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 12,
                color: colors.primaryBackground,
              }}>
              Size: {food.size}
            </Text>
          </View>
          <View style={styles.price}>
            <Text style={[
              styles.pricetext,
              {
                color:colors.secondaryBackground
              },
            ]}>Rs. {food.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    fontFamily: 'Sofia Sans',
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemFont: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  restFont: {
    fontSize: 13,
  },
});
