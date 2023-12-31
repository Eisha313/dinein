import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import uuid from 'react-native-uuid';
import {useTheme} from '@react-navigation/native';
import OrderDetailsCard from './OrderDetailsCard';
import OrderSummary from './OrderSummary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import Orders from './Orders';

export default function OrderDetails({navigation, route}) {
  const {colors} = useTheme();
  const [order, setOrder] = useState(route.params.order);
  const[sum,setSum]=useState(route.params.sum);
  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }

  return (
    <ScrollView>
      <View style={{margin: 20}}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: colors.primary}}>
          Order Details
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: 20,
          marginRight: 20,
        }}>
        <Text style={{fontSize: 16, color: colors.primary}}>Order Number</Text>
        <Text style={{fontSize: 16, color: colors.primaryBackground}}>
          {/* #{order.orderNumber} */}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: 20,
          marginRight: 20,
          marginTop: 10,
          marginBottom: 8,
        }}></View>
      <View>
        {order.foods.map(food => {
          return (
            <View key={uuid.v4()}
            >
              <OrderDetailsCard
                food={food}
                navigation={navigation}
                route={route}></OrderDetailsCard>
            </View>
          );
        })}
      </View>
      <View>
        <OrderSummary sum={sum}></OrderSummary>
      </View>
    </ScrollView>
  );
}
