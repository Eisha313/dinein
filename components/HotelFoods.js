import {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Alert
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import RestaurantCardList from './RestaurantCardList';
import FoodCardList from './FoodCardList';
import Filter from './Filter';
import firestore from '@react-native-firebase/firestore';

export default function HotelFoods({route, navigation}) {
  const {colors} = useTheme();
  const [foods, setFoods] = useState([]);
  const [hotelName, setHotelName] = useState(route.params)
  async function getHotelFoods() {
    try {
      const managers = await firestore().collection('Managers').get();
      let collectionOutput = [];
      managers.forEach(documentSnapshot => {
        collectionOutput.push(documentSnapshot.data().hotels);
      });
      const hotels = [];
      let hotel = undefined;
      collectionOutput.forEach(hs => {
        hs.forEach(tempHotel => {
          hotels.push(tempHotel);
        });
      });
      const index = hotels.findIndex((h) => {
        return h.name === hotelName;
      });
      if (index === -1) return
      const foods = [];
      hotel = hotels[index];
      hotel.foods.forEach(f => {
        f.hotelName = hotel.name;
        foods.push(f);
      });
      setFoods(foods);
    } catch (e) {
      Alert.alert(e.message);
    }
  }
  useEffect(() => {
    getHotelFoods();
  }, []);
  return (
    <View style={customerStyles.bodyContainer}>
      <View style={customerStyles.bodyInner}>
        <View style={{marginTop: 16, width: '100%'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={[
                {color: colors.primary, fontWeight: 'bold', fontSize: 20},
              ]}>
              Foods for {hotelName}
            </Text>
          </View>
          <View>
            <FoodCardList navigation={navigation} foods={foods} />
          </View>
        </View>
      </View>
    </View>
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
