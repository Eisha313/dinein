import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import CustomActivityIndicator from './CustomActivityIndicator';
export default function CardDetails({navigation}) {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const {colors} = useTheme();
  let pattern = /^[0-9]+$/;
  let pattern1 = /^[A-Za-z]+$/;
  let datePattern = /^(0[1-9]|1[0-2])\/?([0-9]{2})+$/;
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const creditCard = {
    name: name,
    cardNumber: number,
    expiry: expiry,
    cvc: cvc,
  };

  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }

  async function addCard() {
    try {
      const user = await getSessionUser()
      const customers = firestore().collection('Customers');
      const customerData = customers.doc(user.id)
      const card = await customerData.update({creditCard:creditCard,isCreditCard:true,balance:0});
      const data = customerData.data();

    } catch (e) {}
  }

  return (
    <ScrollView>
      <View style={{margin: 15}}>
        <Text style={{fontWeight: 'bold', fontSize: 18, color: colors.primary}}>
          Credit Card Details
        </Text>
      </View>
      <View>
        <Text
          style={{
            marginRight: 17,
            marginLeft: 17,
            color: colors.card,
            fontSize: 15,
            fontWeight: 'bold',
          }}>
          Cardholder Name
        </Text>
        <TextInput
          placeholder="Enter Full Name"
          style={{borderBottomWidth: 2, margin: 17, padding: 8, color: colors.primary}}
          value={name}
          onChangeText={setName}></TextInput>
      </View>

      <View>
        <Text
          style={{
            marginRight: 17,
            marginLeft: 17,
            color: colors.card,
            fontSize: 15,
            fontWeight: 'bold',
          }}>
          Card Number
        </Text>
        <TextInput
          maxLength={16}
          keyboardType="numeric"
          placeholder="1234-5678-9012-3345"
          style={{borderBottomWidth: 2, margin: 17, padding: 8, color: colors.primary}}
          value={number}
          onChangeText={setNumber}></TextInput>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: 17,
          marginRight: 49,
        }}>
        <Text
          style={{
            color: colors.card,
            fontSize: 15,
            fontWeight: 'bold',
          }}>
          Exp Date
        </Text>
        <Text
          style={{
            color: colors.card,
            fontSize: 15,
            fontWeight: 'bold',
          }}>
          CVC Number
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: 10,
          marginRight: 10,
        }}>
        <TextInput
          placeholder="01/25"
          style={{borderBottomWidth: 2, margin: 10, width: '40%', padding: 8, color: colors.primary}}
          value={expiry}
          onChangeText={setExpiry}></TextInput>
        <TextInput
          placeholder="445"
          maxLength={3}
          keyboardType="numeric"
          style={{borderBottomWidth: 2, margin: 10, width: '40%', padding: 8, color: colors.primary}}
          value={cvc}
          onChangeText={setCvc}></TextInput>
      </View>
          {
                    !isFormSubmitting ?
                    <TouchableOpacity style={{
                      marginTop: 38,
                      marginRight: 17,
                      marginLeft: 17,
                      backgroundColor: colors.card,
                      alignItems: 'center',
                      padding: 15,
                      borderRadius: 12,
                    }}
                    onPress={() => {
                      if (name.length === 0 || !pattern1.test(name)) {
                        Alert.alert('Enter a Valid Name!');
                        return;
                      }
                      if (number.length !== 16 || !pattern.test(number)) {
                        Alert.alert('Enter a valid Card Number(16 digits)');
                        return;
                      }
                      if (expiry.length === 0 || !datePattern.test(expiry)) {
                        Alert.alert('Enter a Valid Date(month/year)');
                        return;
                      }
                      if (cvc.length !== 3 || !pattern.test(cvc)) {
                        Alert.alert('Enter a valid CVC Number!');
                        return;
                      } else {
                        Alert.alert('Card Details Added!');
                        setName('');
                        setNumber('');
                        setExpiry('');
                        setCvc('');
                      }
                      setIsFormSubmitting(true)
                      addCard();
                      setIsFormSubmitting(false)
                    }}>
                    <Text style={{color: 'white'}}>Add Card</Text>
                  </TouchableOpacity>
                    : <CustomActivityIndicator />
                }
            </ScrollView>
  );
}
