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
      <Image
              style={{
                width: '100%',
                resizeMode: 'contain',
                borderRadius: 10,
                position: 'absolute',
                top: -10,
                right: -40,
              }}
              source={require('../resources/images/hotel.png')}
            />
      <View style={customerStyles.bodyInner}>
        <View style={{marginTop: 100, width: '100%'}}>
          <View style={{marginBottom: 50}}>
            <Text
              style={[
                {color: '#272D2F', fontWeight: 'bold', fontSize: 45},
              ]}>
              Fast
            </Text>
            <Text
              style={[
                {color: '#35654E', marginTop: -20, fontWeight: 'bold', fontSize: 55},
              ]}>
              Foods
            </Text>
            <Text
              style={[
                {color: colors.primary, marginTop: -10,  fontWeight: 'bold', fontSize: 30},
              ]}>
              ( {hotelName} )
            </Text>
          </View>
          <View style={{marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
            <View style={{ flexDirection: 'row'}}>
              <Text style={{color: "#000", fontWeight: 'bold', fontSize: 14}}>Sorted By:   </Text>
              <Text style={{color: "#000", fontSize: 14}}> Date Modified </Text>
            </View>
            <TouchableOpacity style={{ resizeMode: 'contain', height: 30, width: 30, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', elevation: 5, padding: 5 }}>
              <Image style={{height: 15, width: 15,}} source={require('../resources/images/filterIcon.png')} />
            </TouchableOpacity>

          </View>
          <View style={{paddingTop: 30}}>
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
