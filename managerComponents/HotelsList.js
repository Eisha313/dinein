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
import HotelCard from './HotelCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import uuid from 'react-native-uuid';

function HotelsList({ navigation }) {
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [hotels, setHotels] = useState([]);
  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }

  async function getHotels() { //get hotels from firestore document
    const dbHotelCollection = [];
    const ManagerCollection = firestore().collection('Managers');
    try {
      const user = await getSessionUser()
      const ManagerCollectionData = (await ManagerCollection.doc(user.id).get()).data();
      ManagerCollectionData.hotels.forEach(hotel => {
        dbHotelCollection.push(hotel);
      })
      if (search.length !== 0){
        setHotels(dbHotelCollection.filter(hotel => hotel.name.includes(search)))
      }
      else{
        setHotels(dbHotelCollection);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getHotels();
  }, [isFocused])

  useEffect(() => { //calling get hotels function
    getHotels();
  }, [search])

  async function deleteHotel(name) { //delete hotel from firestore
    const ManagerCollection = firestore().collection('Managers');
    try {
      const user = await getSessionUser()
      let allHotels = (await ManagerCollection.doc(user.id).get()).data();
      allHotels.hotels.forEach(async hotel => {
        if (hotel.name === name) {
          const objToRemove = hotel; //object to remove from hotels array
          await ManagerCollection.doc(user.id).update({
            hotels: firebase.firestore.FieldValue.arrayRemove(objToRemove)
          })
          await getHotels();
        }
      }
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={hotelRegStyles.bodyContainer}>
      <View style={hotelRegStyles.screenView}>
        <View style={hotelRegStyles.formInputsView}>
          <TextInput
            style={[
              hotelRegStyles.formInputs,
              {
                borderColor: colors.secondaryBackground,
                color: colors.primary,
              },
            ]}
            placeholder="Search Hotels"
            placeholderTextColor={colors.primary}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={hotelRegStyles.sortView}>
            <View>
              <Image
                style={hotelRegStyles.iconSetting}
                source={require('../assets/images/filterr.png')}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={hotelRegStyles.addRestView}>
          <TouchableOpacity style={hotelRegStyles.addRest} onPress={() => navigation.navigate('Hotel Registration')}>
            <Text
              style={[
                {
                  color: colors.primaryText,
                  fontSize: 16,
                  letterSpacing: 1,
                  fontWeight: 'bold',
                },
              ]}>
              Add Restaurant
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ width: '100%' }}>
          {
            hotels.map(hotel => {
              return (
                <HotelCard hotel={hotel} navigation={navigation} key={uuid.v4()} setHotels={setHotels} deleteHotel = {deleteHotel} particularHotel = {hotel.name}/>
              )
            })}
        </ScrollView>
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

  formInputs: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5,
    fontSize: 16,
    width: '80%',
  },

  formInputsView: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  iconSetting: {
    width: 32,
    height: 32,
  },

  sortView: {
    backgroundColor: '#41179F',
    width: '16%',
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

export default HotelsList;
