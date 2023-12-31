import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import CustomActivityIndicator from './CustomActivityIndicator';
export default function PastOrderCard({ order,navigation}) {
  const { colors } = useTheme();
  const [img, setImg] = useState();
  const [sum, setSum] = useState(0);
  
  useEffect(() => {
    let totalPrice =0
    storage()
      .ref(order.foods[0].image) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setImg(url);
      });
    
      order.foods.forEach(p => {
        totalPrice = totalPrice + p.price;
      })
    setSum(totalPrice)
    
  }, []);
  if (img === undefined) {
    return (
        <CustomActivityIndicator />
    )
}
  return (
    <View>
      <TouchableOpacity onPress={()=>{navigation.navigate('Past Order Details',order)}}
        style={[styles.container, { borderColor: colors.card }]}>
        <View style={styles.orderno}>
          <Image
            style={styles.imageStyle}
            source={{ uri: img }}></Image>
          <View style={styles.items}>
            <Text style={[styles.itemFont,{color:colors.primary}]}>{order.foods.length} items</Text>
            <Text style={[styles.restFont,{color:colors.primary}]}>{order.restaurant}</Text>
          </View>
          <View style={styles.price}>
            <Text style={[styles.pricetext,{color:colors.card}]}>#{order.orderNo}</Text>
            <Text style={[styles.pricetext,{color:colors.card}]}>Rs. {sum}</Text>
          </View>
        </View>

        <View style={styles.arrival}>
          <Text style={[styles.arrivalFont, { color: colors.primary }]}>
            Arrived At
          </Text>
          <View>
            
            <Text style={{ fontSize: 14 }}>Delievered</Text>
          </View>
        </View>

        <View style={[styles.time,{color:colors.primary}]}>
          <Text style={[styles.dateFont,,{color:colors.primary}]}>{order.orderDate},</Text>
          <Text style ={[styles.timeFont,{color:colors.primary}]}>
          {order.deliveryTime} PM
          </Text>
        </View>

        <View style={styles.alig}>
          <TouchableOpacity
          onPress={()=>{navigation.navigate('Past Order Details',order)}}
            style={[
              styles.Orderbtn,
              {
                borderColor: colors.card,
                backgroundColor: colors.card,
              },
            ]}>
            <Text style={{ color: colors.background }}> Select Items to re-order </Text>
          </TouchableOpacity>
          
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
    borderRadius: 33,
  },
  imageStyle: {
    height: 80,
    width: 80,
    borderRadius: 22,
  },
Orderbtn: {
    borderWidth: 2,
    borderRadius: 30,
    alignItems: 'center',
    width: '75%',
    padding: 10,
  },
  alig: {
    margin: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
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
  arrival: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  time: {
    flexDirection:'row',
    alignItems:'center',
    marginBottom: 10,
  },
  timeFont: {
    marginTop:4, 
    fontWeight: 'bold',
    fontSize: 15,
  },
  dateFont: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  pricetext: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemFont: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  restFont: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
