import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import OrderCard from './OrderCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import uuid from 'react-native-uuid';

export default function Orders({navigation}) {
  const {colors} = useTheme();
  const [orders, setOrders] = useState([]);
  const isFocused = useIsFocused();


  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }


  async function getOrders() {
    try {
      const user = await getSessionUser()
      const customers = firestore().collection('Customers');
      const customerData = await customers.doc(user.id).get();
      const data = customerData.data();
      if (data.orders === undefined) {
        setOrders([]);
      } else {
        setOrders(
          data.orders.filter(o => {
            return o.isActive === true;
          }),
        );
      }
      console.log(data);
    } catch (e) {}
  }
  async function deleteOrder(id) {
    setOrders(orders.filter(o => {
      return o.id !== id
    }))
  }

  useEffect(() => {
    async function caller() {
      await getOrders();
    }
    caller();
  }, [isFocused]);

  
  return (
    <ScrollView>
      <View>
        <View>
          <View style={[styles.btnTop, {borderColor: colors.card}]}>
            <TouchableOpacity
              onPress={() => navigation.push('My Orders')}
              style={[
                styles.btn,
                {
                  borderColor: colors.card,
                  backgroundColor: colors.card,
                },
              ]}>
              <Text style={{color: colors.background}}>Current Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Past Orders')}
              style={[
                styles.btn1,
                {
                  color: colors.card,
                },
              ]}>
              <Text style={{color: colors.primaryBackground}}>Past Orders</Text>
            </TouchableOpacity>
          </View>
        </View>
        {orders.map(order => {
          return <OrderCard key={uuid.v4()} order={order} navigation={navigation} deleteOrder={deleteOrder}></OrderCard>;
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 2,
    borderRadius: 30,
    alignItems: 'center',
    width: '50%',
    padding: 10,
    margin: 2,
  },
  btn1: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    padding: 10,
  },
  btnTop: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 17,
    marginRight: 17,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 40,
  },
});
