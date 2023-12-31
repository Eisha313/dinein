import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import PastOrderCard from './PastOrderCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

export default function PastOrders({navigation}) {
  const {colors} = useTheme();
  const [orders, setOrders] = useState([]);
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
            return o.isActive === false;
          }),
        );
      }
      console.log(data);
    } catch (e) {}
  }
  useEffect(() => {
    async function caller() {
      await getOrders();
    }
    caller();
  }, []);

  return (
    <ScrollView>
      <View>
        <View style={[styles.btnTop, {borderColor: colors.card}]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('My Orders')}
            style={[
              styles.btn1,
              {
                color: colors.card,
              },
            ]}>
            <Text style={{color: colors.primaryBackground}}>
              Current Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.push('Past Orders')}
            style={[
              styles.btn,
              {
                borderColor: colors.card,
                backgroundColor: colors.card,
              },
            ]}>
            <Text style={{color: colors.background}}>Past Orders</Text>
          </TouchableOpacity>
        </View>

        {orders.map(order => {
          return (
            <PastOrderCard
            key={uuid.v4()}
              order={order}
              navigation={navigation}></PastOrderCard>
          );
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
