import { React, useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import uuid from 'react-native-uuid';

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
import AsyncStorage from '@react-native-async-storage/async-storage';
const longitude = 33.6844;
const latitude = 73.0479;

function ViewRestaurant({ navigation, route }) {
  const { colors } = useTheme();
  const hotel = route.params.hotel;
  const rating = route.params.rating;
  const hotelImage = route.params.hotelImage;
  const { name, address, email, contact, stars, description } = hotel;
  console.log('Hello from View Restaurant', name)

  return (
    <View style={ViewResStyles.bodyContainer}>
      <View style={ViewResStyles.screenView}>
        <ScrollView style={{ width: '100%' }}>
          <View style={ViewResStyles.imageContainer}>
            <Image
              style={ViewResStyles.imageHotel}
              source={{ uri: hotelImage }}
            />
          </View>
          <View style={ViewResStyles.hotelDesc}>
            <View style={ViewResStyles.upperPart}>
              <View>
                <Text
                  style={[
                    {
                      color: colors.primary,
                      fontSize: 20,
                      fontWeight: 'bold',
                      letterSpacing: 1,
                    },
                  ]}>
                  {name}
                </Text>
              </View>
              <View style={ViewResStyles.starRating}>
                <View>
                  <Image source={require('../assets/images/starrating.png')} />
                </View>
                <View>
                  <Text
                    style={[
                      {
                        color: colors.primary,
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginLeft: 2,
                      },
                    ]}>
                    {rating} / 5
                  </Text>
                </View>
              </View>
            </View>
            <View style={ViewResStyles.locationView}>
              <View>
                <Image
                  source={require('../assets/images/locationsymbol.png')}
                />
              </View>
              <View>
                <Text
                  style={[
                    {
                      color: '#7A7289',
                      fontSize: 16,
                      marginLeft: 3,
                    },
                  ]}>
                  {address}
                </Text>
              </View>
            </View>
          </View>
          <View style={ViewResStyles.buttonView}>
            <View style={{ width: '100%', flexDirection: 'row'}}>
              <TouchableOpacity
                style={[
                  ViewResStyles.addButton,
                  { backgroundColor: colors.secondaryBackground },
                ]}
                onPress={() => navigation.navigate('Add Food', { specificHotelName: name })}
              >
                <Text
                  style={[{ color: colors.secondaryText, fontWeight: 'bold' }]}>
                  Add Food
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[ViewResStyles.addButton, { backgroundColor: '#D4DDEC' }]}>
                <Text style={[{ color: colors.primary, fontWeight: 'bold' }]}>
                  Reviews
                </Text>
              </TouchableOpacity>
            </View>

          </View>
          <View style={ViewResStyles.description}>
            <Text style={[{ color: '#7A7289', textAlign: 'left', fontSize: 20 }]}>
              {description}
            </Text>
          </View>
          <View style={ViewResStyles.mapsView}>
            <View>
              <Text
                style={[
                  { color: colors.primary, fontWeight: 'bold', fontSize: 20 },
                ]}>
                Location
              </Text>
            </View>
            <View style={ViewResStyles.mapsViewSetting}>
              <MapView
                style={ViewResStyles.mapsImage}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                region={{
                  latitude: longitude,
                  longitude: latitude,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}>
                <Marker
                  coordinate={{ latitude: longitude, longitude: latitude }}
                  title={name}
                />
              </MapView>
            </View>
          </View>
          <View style={ViewResStyles.foodsTitle}>
            <View>
              <Text
                style={{
                  color: colors.primary,
                  marginTop: 10,
                  fontWeight: 'bold',
                  fontSize: 20,
                }}>
                Food Items
              </Text>
            </View>
            <View>
              <TouchableOpacity style={ViewResStyles.viewMore} onPress={() => navigation.navigate('Food List', { specificHotelName: name })}>
                <Text style={[{ color: colors.secondaryBackground, marginRight: 1 }]}>View More</Text>
                <Image source={require('../assets/images/next.png')} style={{ marginTop: 3 }} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={ViewResStyles.foodsView}>
            <View style={ViewResStyles.foodCard}>
              <Image source={require('../assets/images/food1.jpg')} style={{ width: '100%', height: 80, borderRadius: 8 }} />
              <Text style={{ color: colors.primary, marginTop: 5 }}>Chicken</Text>
            </View>
            <View style={ViewResStyles.foodCard}>
              <Image source={require('../assets/images/food2.jpg')} style={{ width: '100%', height: 80, borderRadius: 8 }} />
              <Text style={{ color: colors.primary, marginTop: 5 }}>Mutton</Text>
            </View>
            <View style={ViewResStyles.foodCard}>
              <Image source={require('../assets/images/food3.jpg')} style={{ width: '100%', height: 80, borderRadius: 8 }} />
              <Text style={{ color: colors.primary, marginTop: 5 }}>Burger</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const ViewResStyles = StyleSheet.create({
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

  imageContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 5,
  },

  imageHotel: {
    width: '100%',
    borderRadius: 10,
    height: 200,
  },

  hotelDesc: {
    width: '100%',
    flexDirection: 'column',
  },

  starRating: {
    flexDirection: 'row',
  },

  upperPart: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  locationView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  addButton: {
    width: '60%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginRight: 10
  },

  buttonView: {
    width: '50%',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  description: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-start',
  },

  mapsView: {
    marginTop: 10,
    width: '100%',
  },

  mapsViewSetting: {
    width: '100%',
  },

  mapsImage: {
    marginTop: 5,
    width: '100%',
    height: 150,
    borderWidth: 2,
    borderRadius: 10,
  },

  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  foodsTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },

  foodsView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  foodCard: {
    marginTop: 5,
    width: '30%',
    height: 120,
    borderColor: 'black',
    borderRadius: 5,
    shadowColor: '#black',
    elevation: 2,
    shadowColor: '#52006A',
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    paddingTop: 15,
  }

});

export default ViewRestaurant;
