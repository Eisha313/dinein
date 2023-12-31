import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import CustomActivityIndicator from './CustomActivityIndicator';
export default function MyWallet({navigation}) {
  const {colors} = useTheme();
  let pattern = /^[0-9]+$/;
  const [amount, setAmount] = useState('');
  const [bal, setBal] = useState(0);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }

  async function addAmount() {
    
      let sum = bal + parseInt(amount);
    try {
      const user = await getSessionUser()
      const customers = firestore().collection('Customers');
      const customerData = customers.doc(user.id);
      const card = await customerData.update({balance: sum});
      setBal(bal + parseInt(amount))
      //viewAmount()
    } catch (e) {
      console.log(e)
    }
  }

  async function viewAmount() {
    try {
      const user = await getSessionUser()
      const customers = firestore().collection('Customers');
      const customerData = await customers.doc(user.id).get();
      const data = customerData.data();
      console.log(data);
      setBal(data.balance);
    } catch (e) {}
  }
  useEffect(() => {
    async function caller() {
      await viewAmount();
    }
    caller();
  }, []);

  return (
    <ScrollView>
      <View>
        <View
          style={{
            backgroundColor: colors.secondaryBackground,
            height: 140,
            padding: 30,
            margin: 20,
            borderTopRightRadius: 25,
            borderBottomLeftRadius: 25,
          }}>
          <Text style={{color: colors.text, fontSize: 20}}>
            Your Current Balance
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 12,
            }}>
            Rs. {bal}
          </Text>
        </View>
      </View>
      <View>
        <Text
          style={{
            marginRight: 17,
            marginLeft: 17,
            fontSize: 15,
            fontWeight: 'bold',
            color: colors.primary,
          }}>
          Add Amount
        </Text>
        <TextInput
          placeholder="Enter Amount in Digits"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={{
            borderWidth: 2,
            padding: 10,
            borderRadius: 10,
            margin: 17,
            color: colors.primary,
            borderColor: colors.card,
            backgroundColor: colors.ternaryBackground,
          }}></TextInput>
      </View>
      {
                    !isFormSubmitting ?
                    <TouchableOpacity style={{
                      marginTop: 26,
                      marginRight: 17,
                      marginLeft: 17,
                      backgroundColor: colors.card,
                      alignItems: 'center',
                      padding: 15,
                      borderRadius: 12,
                    }}
                      onPress={() => {
                        if (pattern.test(amount)) {
                          Alert.alert('Amount Deposited');
                          setAmount('');
                          setIsFormSubmitting(true)
                          addAmount();
                          setIsFormSubmitting(false)
                        } else {
                          Alert.alert('Enter a valid digit');
                          setAmount('');
                        }
                      }}>
                      <Text style={{color: colors.background}}>Add Amount</Text>
                    </TouchableOpacity>
                    : <CustomActivityIndicator />
                }
        
    </ScrollView>
  );
}
