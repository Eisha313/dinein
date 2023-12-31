import { React, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import firestore, { firebase } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import CustomActivityIndicator from '../components/CustomActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function HotelCard({ hotel, navigation, deleteHotel, particularHotel}) {
  const { colors } = useTheme();
  const [image, setImage] = useState(undefined)
  const [rating, setRating] = useState(0)

  useEffect(() => {
    //getting hotel reviews
    let reviewCount = 0
    let totalStars = 0
    hotel.foods.forEach(food => {
      food.reviews.forEach(r => {
        totalStars += r.stars
        reviewCount++
      })
    })

    //setting hotel reviews
    if (reviewCount === 0) setRating(0)
    else setRating(totalStars / reviewCount)

    storage()
      .ref(hotel.hotelImage) //name in storage in firebase console
      .getDownloadURL()
      .then((url) => {
        setImage(url)
      })

  }, [])

  console.log(particularHotel)
  if (image === undefined) {
    return (
        <CustomActivityIndicator />
    )
  }
  return (
    <View style={hotelRegStyles.hotelCard}>
      <View>
        <Image
          style={hotelRegStyles.hotelImage}
          source={{ uri: image }}
        />
      </View>
      <View style={hotelRegStyles.hotelInfo}>
        <View style={hotelRegStyles.editBtnsView}>
          <View>
            <Text
              style={[
                {
                  color: colors.primaryText,
                  fontSize: 20,
                  fontWeight: 'bold',
                  letterSpacing: 1,
                  marginLeft: 10,
                },
              ]}>
              {hotel.name}
            </Text>
          </View>
          <View style={hotelRegStyles.screenButtons}>
            <TouchableOpacity onPress={() => navigation.navigate({
              name: 'View Restaurant',
              params: { hotel: hotel, hotelImage: image, rating: rating},
            })}>
              <View style={hotelRegStyles.viewBtn}>
                <Image source={require('../assets/images/eye.png')} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Hotel Registration', {hotel: hotel, particularHotel: particularHotel})}>
              <View style={hotelRegStyles.editBtn}>
                <Image
                  source={require('../assets/images/edit.png')}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteHotel(hotel.name)}>
              <View style={hotelRegStyles.deleteBtn}>
                <Image
                  source={require('../assets/images/Delete.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={hotelRegStyles.hotelRating}>
          <View>
            <Image source={require('../assets/images/Star.png')} />
          </View>
          <View style={{ marginLeft: 5 }}>
            <Text
              style={{
                color: colors.star,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              {rating} / 5
            </Text>
          </View>
        </View>
        <View style={hotelRegStyles.locationView}>
          <Image source={require('../assets/images/Location.png')} />
          <Text
            style={[
              {
                color: colors.primaryText,
                fontSize: 16,
                fontWeight: 'bold',
                letterSpacing: 1,
                marginLeft: 5,
              },
            ]}>
            {hotel.address}
          </Text>
        </View>
      </View>
    </View>
  );
}

const hotelRegStyles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  screenView: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
  },

  iconSetting: {
    width: 32,
    height: 32,
  },

  sortView: {
    backgroundColor: '#41179F',
    width: 50,
    height: 42,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
    borderRadius: 5,
  },

  addRest: {
    alignItems: 'center',
    backgroundColor: '#D1141B',
    padding: 15,
    borderRadius: 5,
  },

  addRestView: {
    width: '100%',
    marginTop: 15,
  },

  hotelCard: {
    width: '100%',
    marginTop: 15,
    backgroundColor: '#D1141B',
    borderRadius: 10,
  },

  hotelImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },

  hotelInfo: {
    flexDirection: 'column',
    width: '100%',
  },

  editBtnsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },

  hotelRating: {
    flexDirection: 'row',
    marginLeft: 10,
  },

  screenButtons: {
    flexDirection: 'row',
    marginRight: 10,
  },

  deleteBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#FFC22B',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  editBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#38C74F',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  viewBtn: {
    width: 30,
    height: 30,
    backgroundColor: '#0EC0A0',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  locationView: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 20,
    justifyContent: 'flex-end',
    marginRight: 10,
    alignItems: 'center',
  },
});
