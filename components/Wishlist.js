import {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import RestaurantCardList from './RestaurantCardList';
import FoodCardList from './FoodCardList';
import Filter from './Filter';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Wishlist({navigation}) {
  const isFocused = useIsFocused();
  const {colors} = useTheme();
  const [foods, setFoods] = useState([]);
  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }
  async function getWishlist() {
    try {
      const user = await getSessionUser()
      const customers = firestore().collection('Customers');
      const customerData = await customers.doc(user.id).get();
      const data = customerData.data();
      if (data.wishlist !== undefined) setFoods(data.wishlist);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getWishlist();
  }, [isFocused]);
  return (
    <ScrollView>
    <View style={customerStyles.bodyContainer}>
      <View style={customerStyles.bodyInner}>
        <View style={{marginTop: 16, width: '100%'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={[
                {color: colors.primary, fontWeight: 'bold', fontSize: 20},
              ]}>
              Wishlist
            </Text>
          </View>
          <View style={{marginTop: 16}}>
            <FoodCardList navigation={navigation} foods={foods} />
          </View>
        </View>
      </View>
    </View>
    </ScrollView>
  );
}

const customerStyles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bodyInner: {
    width: '85%',
    flexDirection: 'column',
  },
  bodyHeadingMain: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  container: {
    marginBottom: 48,
  },
  primaryButton: {
    borderRadius: 50,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 32,
  },
  primaryButtonText: {
    fontSize: 16,
  },
  styledInput: {
    borderRadius: 10,
  },
});
