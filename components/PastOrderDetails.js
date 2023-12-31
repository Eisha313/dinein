import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import uuid from 'react-native-uuid';

import {useTheme} from '@react-navigation/native';
import PastOrderDetailsCard from './PastOrderDetailsCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

export default function PastOrderDetails({navigation,route}) {
  const {colors} = useTheme();
  const [order, setOrder] = useState(route.params);
  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }
  return (
    <ScrollView>
      <View style={{margin: 20}}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: colors.primary}}>
          Select Items
        </Text>
      </View>
      <View>
      {order.foods.map(food => {
          return (
            <View key={uuid.v4()}>
              <PastOrderDetailsCard 
                food={food}
                navigation={navigation}
                route={route}></PastOrderDetailsCard>
            </View>
          );
        })}
      </View>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Items Added to Cart!');
            navigation.navigate('Past Orders');
          }}
          style={{
            borderWidth: 2,
            borderRadius: 30,
            alignItems: 'center',
            width: '75%',
            padding: 12,
            marginTop: 30,
            borderColor: colors.card,
            backgroundColor: colors.card,
          }}>
          <Text style={{color: colors.background}}> Add to Cart </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
