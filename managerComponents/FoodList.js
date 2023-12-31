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
import uuid from 'react-native-uuid';

import { useTheme } from '@react-navigation/native';
import firestore, { firebase } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import FoodCard from './FoodCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
function FoodList({ navigation, route }) {
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [foods, setFoods] = useState([]);
  const [category, setCategory] = useState('')
  const [specificHotelName, setSpecificHotelName] = useState(route.params.specificHotelName)

  useEffect(() => {
    getFoods();
  }, [isFocused])


  useEffect(() => { //calling get Foods Function
    getFoods();
  }, [search])


  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }
  async function getFoods() { //get hotels from firestore document
    const dbFoodCollection = [];
    const ManagerCollection = firestore().collection('Managers');
    try {
      const user = await getSessionUser()
      const ManagerCollectionData = (await ManagerCollection.doc(user.id).get()).data();
      ManagerCollectionData.hotels.forEach(hotel => {
        if (hotel.name === specificHotelName) {
          hotel.foods.forEach(food => {
            dbFoodCollection.push(food)
          })
        }
      })

      console.log(specificHotelName)
      console.log(dbFoodCollection)

      if (search.length !== 0) {
        setFoods(dbFoodCollection.filter(food => food.name.toLowerCase().includes(search.toLowerCase())))
      }
      else {
        setFoods(dbFoodCollection);
      }
    } catch (error) {
      console.log(error);
    }
  }


  const deleteFood = async (foodName, hotelName) => {
    console.log(foodName, hotelName)
    const ManagerCollection = firestore().collection('Managers');
    try {
      const user = await getSessionUser()
      const ManagerCollectionData = (await ManagerCollection.doc(user.id).get()).data(); //getting collection data
      const hotels = ManagerCollectionData.hotels //getting hotels from data
      let i;
      for (let index = 0; index < hotels.length; index++) {
        if (ManagerCollectionData.hotels[index].name.toString() === hotelName.toString()) {
          i = index
        }
      }
      hotels[i].foods = hotels[i].foods.filter(food => food.name !== foodName) //filtering the foods
      const test = ManagerCollection.doc(user.id)
      await test.update({
        hotels: hotels
      })
      await getFoods()
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <View style={foodListStyles.bodyContainer}>
      <View style={foodListStyles.screenView}>
        <View style={foodListStyles.searchView}>
          <TextInput
            style={[
              foodListStyles.formInputs,
              {
                borderColor: colors.secondaryBackground,
                color: colors.primary,
              },
            ]}
            placeholder="Search Foods"
            placeholderTextColor={colors.primary}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={foodListStyles.sortView}>
            <View>
              <Image
                style={foodListStyles.iconSetting}
                source={require('../assets/images/filterr.png')}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={foodListStyles.categoriesView}>
          <TouchableOpacity
            onPress={() => {
              setCategory('All')
            }}>
            <Text
              style={[
                {
                  color: category === 'All' ? colors.secondaryBackground : colors.primary,
                  fontWeight: 'bold',
                  fontSize: category === 'All' ? 18 : 16,
                },
              ]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCategory('Breakfast')
            }}>
            <Text
              style={[
                {
                  color: category === 'Breakfast'
                    ? colors.secondaryBackground
                    : colors.primary,
                  fontWeight: 'bold',
                  fontSize: category === 'Breakfast' ? 18 : 16,
                },
              ]}>
              Breakfast
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCategory('Lunch')
            }}>
            <Text
              style={[
                {
                  color: category === 'Lunch' ? colors.secondaryBackground : colors.primary,
                  fontWeight: 'bold',
                  fontSize: category === 'Lunch' ? 18 : 16,
                },
              ]}>
              Lunch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCategory('Treats')
            }}>
            <Text
              style={[
                {
                  color: category === 'Treats' ? colors.secondaryBackground : colors.primary,
                  fontWeight: 'bold',
                  fontSize: category === 'Treats' ? 18 : 16,
                },
              ]}>
              Treats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCategory('Drinks')
            }}>
            <Text
              style={[
                {
                  color: category === 'Drinks' ? colors.secondaryBackground : colors.primary,
                  fontWeight: 'bold',
                  fontSize: category === 'Drinks' ? 18 : 16,
                },
              ]}>
              Drinks
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ width: '100%' }}>
          {/* Single Food Component*/}
          <View style={foodListStyles.foodsView}>
            {foods.map(food => {
              return (
                <FoodCard food={food} navigation={navigation} deleteFood={deleteFood} specificHotelName={specificHotelName} key = {uuid.v4()}/>
              );
            })}
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={[
                foodListStyles.addButton,
                { backgroundColor: colors.secondaryBackground },
              ]}
              onPress={() => navigation.navigate('Add Food', { specificHotelName: specificHotelName })}
            >
              <Image source={require('../assets/images/addIcon.png')} />
              <Text
                style={{
                  color: colors.secondaryText,
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginLeft: 2,
                }}>
                Add Food
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const foodListStyles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  screenView: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '95%',
  },

  searchView: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  categoriesView: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-evenly',
  },

  foodsView: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 5,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  foodCard: {
    width: '48%',
    flexDirection: 'column',
    marginTop: 10,
    borderRadius: 5,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 1,
  },

  foodCardPicture: {
    width: '100%',
    height: 100,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },

  deleteBtn: {
    width: 24,
    height: 24,
    backgroundColor: '#D1141B',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  editBtn: {
    width: 24,
    height: 24,
    backgroundColor: '#38C74F',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },

  viewBtn: {
    width: 24,
    height: 24,
    backgroundColor: '#0EC0A0',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  screenBtns: {
    flexDirection: 'row',
    marginRight: 10,
  },

  addButton: {
    marginTop: 10,
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
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
});

export default FoodList;
