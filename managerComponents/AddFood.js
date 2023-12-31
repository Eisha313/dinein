import { React, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore, { firebase } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress'
import { ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActivityIndicator from '../components/CustomActivityIndicator';
function AddFood({ navigation, route }) {
  const { colors } = useTheme();
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState("");
  const [productdesc, setProductDesc] = useState('');
  const [imageSource, setImageSource] = useState(undefined);
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [delieveryfee, setDelieveryFee] = useState('');
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [specificHotelName, setSpecificHotelName] = useState('');
  const [btn, setBtn] = useState(false)
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  useEffect(() => {
    const name = route.params.specificHotelName;
    setSpecificHotelName(name)
  }, [])

  useEffect(() => {
    if (route.params.food) {
      const food = route.params.food;
      const { name, category, description, price, size, fee } = food;
      setProductName(name);
      setCategory(category);
      setProductDesc(description);
      setPrice(price.toString());
      setSize(size);
      setDelieveryFee(fee.toString());
      setImageSource(undefined)
      setBtn(true);
    }
  }, [route.params?.food])


  const selectImage = () => { //upload image from Gallary
    const options = {
      maxWidth: 1280,
      maxHeight: 720,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => { //Assiging image path to state variable
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response.assets[0].uri);
        setImageSource(response.assets[0].uri);
      }
    });
  };


  const uploadImage = async (fileSource) => { //converting link to upload it on firestore
    const filename = fileSource.substring(fileSource.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : fileSource;

    setUploading(true);
    setTransferred(0);

    const task = storage()
      .ref(filename)
      .putFile(uploadUri);

    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      );
    });

    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    return filename
  };
  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }
  async function addFood() { //get foods from firestore document
    const imageUrl = await uploadImage(imageSource);
    const foodObj = { name: productName, category: category, description: productdesc, size: size, price: parseInt(price), fee: parseInt(delieveryfee), foodImage: imageUrl, reviews: [] }
    const ManagerCollection = firestore().collection('Managers');
    try {
      const user = await getSessionUser()
      const ManagerCollectionData = (await ManagerCollection.doc(user.id).get()).data(); //getting collection data
      const hotels = ManagerCollectionData.hotels //getting hotels from data
      let hotelIndex;
      for (let index = 0; index < hotels.length; index++) {
        if (ManagerCollectionData.hotels[index].name.toString() === specificHotelName.toString()) {
          hotelIndex = index
        }
      }
      hotels[hotelIndex].foods.push(foodObj) //modifying the specific hotel foods
      const test = ManagerCollection.doc(user.id)
      await test.update({
        hotels: hotels
      })

      setProductName('');
      setCategory('');
      setProductDesc('');
      setSize('');
      setPrice('');
      setDelieveryFee('');
      setImageSource(undefined);
      navigation.navigate('Food List', { specificHotelName: specificHotelName })
      alert('Your Food is Live')

    } catch (error) {
      console.log(error);
    }
  }

  const updateFood = async () => {  //updating food from database
    const sProductName = route.params.name;
    console.log(sProductName)
    const imageUrl = await uploadImage(imageSource);
    const foodObj = { name: productName, category: category, description: productdesc, size: size, price: parseInt(price), fee: parseInt(delieveryfee), foodImage: imageUrl, reviews: [] }
    const ManagerCollection = firestore().collection('Managers');
    try {
      const user = await getSessionUser()
      const ManagerCollectionData = (await ManagerCollection.doc(user.id).get()).data(); //getting collection data
      const hotels = ManagerCollectionData.hotels //getting hotels from data
      let hotelIndex;
      let foodIndex;
      for (let index = 0; index < hotels.length; index++) {
        if (ManagerCollectionData.hotels[index].name.toString() === specificHotelName.toString()) {
          hotelIndex = index
          for (let indexx = 0; indexx < hotels[hotelIndex].foods.length; indexx++) {
            if (ManagerCollectionData.hotels[hotelIndex].foods[indexx].name.toString() === sProductName.toString()){
              foodIndex = indexx
            } 
          }
        }
      }
      hotels[hotelIndex].foods[foodIndex] = foodObj; //modifying the specific hotel foods
      console.log(hotels[1])
      const test = ManagerCollection.doc(user.id)
      await test.update({
        hotels: hotels
      })

      setProductName('');
      setCategory('');
      setProductDesc('');
      setSize('');
      setPrice('');
      setDelieveryFee('');
      setImageSource(undefined);
      navigation.navigate('Food List', { specificHotelName: specificHotelName })
      alert('Your Food is Live')

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={addFoodStyles.bodyContainer}>
      <View style={addFoodStyles.screenView}>
        <ScrollView style={{ width: '100%' }}>
          <View style={addFoodStyles.addTitle}>
            <Text
              style={[
                {
                  color: colors.primaryBackground,
                  fontSize: 20,
                  fontWeight: 'bold',
                },
              ]}>
              Add Food To Your Restaurant
            </Text>
          </View>
          <View style={addFoodStyles.formInputsView}>
            <Text
              style={[
                { color: colors.secondaryBackground },
                addFoodStyles.formLabels,
              ]}>
              Product Name*
            </Text>
            <TextInput
              style={[
                addFoodStyles.formInputs,
                {
                  borderColor: colors.secondaryBackground,
                  color: colors.primary,
                },
              ]}
              placeholderTextColor={colors.primary}
              value={productName}
              onChangeText={setProductName}
            />
          </View>
          <View style={{ width: '100%', marginTop: 10 }}>
            <Text
              style={[
                { color: colors.secondaryBackground },
                addFoodStyles.formLabels,
              ]}>
              Product Category*
            </Text>
          </View>
          <View style={addFoodStyles.twoRows}>
            <View style={addFoodStyles.rowOne}>
              <TouchableOpacity
                style={addFoodStyles.touchableCategory}
                onPress={() => {
                  setCategory("Breakfast");
                }}>
                <View
                  style={[
                    addFoodStyles.categoryCard,
                    {
                      borderWidth: category === 'Breakfast' ? 2 : 0,
                      borderColor: colors.secondaryBackground,
                    },
                  ]}>
                  <Image
                    style={addFoodStyles.cardImage}
                    source={require('../assets/images/cateogories/breakfast.png')}
                  />
                  <Text style={[{ color: colors.primary }]}>
                    Breakfast
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={addFoodStyles.touchableCategory}
                onPress={() => {
                  setCategory("Lunch");
                }}>
                <View
                  style={[
                    addFoodStyles.categoryCard,
                    {
                      borderWidth: category === "Lunch" ? 2 : 0,
                      borderColor: colors.secondaryBackground,
                    },
                  ]}>
                  <Image
                    style={addFoodStyles.cardImage}
                    source={require('../assets/images/cateogories/lunch.png')}
                  />
                  <Text style={[{ color: colors.primary }]}>
                    Lunch
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={addFoodStyles.touchableCategory}
                onPress={() => {
                  setCategory("Treats");
                }}>
                <View
                  style={[
                    addFoodStyles.categoryCard,
                    {
                      borderWidth: category === 'Treats' ? 2 : 0,
                      borderColor: colors.secondaryBackground,
                    },
                  ]}>
                  <Image
                    style={addFoodStyles.cardImage}
                    source={require('../assets/images/cateogories/treats.png')}
                  />
                  <Text style={[{ color: colors.primary, marginBottom: 5 }]}>
                    Treats
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={addFoodStyles.rowTwo}>
              <TouchableOpacity
                style={addFoodStyles.touchableCategory}
                onPress={() => {
                  setCategory("Dessert");
                }}>
                <View
                  style={[
                    addFoodStyles.categoryCard,
                    {
                      borderWidth: category === 'Dessert' ? 2 : 0,
                      borderColor: colors.secondaryBackground,
                    },
                  ]}>
                  <Image
                    style={addFoodStyles.cardImage}
                    source={require('../assets/images/cateogories/dessert.png')}
                  />
                  <Text style={[{ color: colors.primary, marginBottom: 5 }]}>
                    Dessert
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={addFoodStyles.touchableCategory}
                onPress={() => {
                  setCategory("Drinks");
                }}>
                <View
                  style={[
                    addFoodStyles.categoryCard,
                    {
                      borderWidth: category === "Drinks" ? 2 : 0,
                      borderColor: colors.secondaryBackground,
                    },
                  ]}>
                  <Image
                    style={addFoodStyles.cardImage}
                    source={require('../assets/images/cateogories/drinks.png')}
                  />
                  <Text style={[{ color: colors.primary, marginBottom: 5 }]}>
                    Drinks
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={addFoodStyles.touchableCategory}
                onPress={() => {
                  setCategory("Dinner");
                }}>
                <View
                  style={[
                    addFoodStyles.categoryCard,
                    {
                      borderWidth: category === "Dinner" ? 2 : 0,
                      borderColor: colors.secondaryBackground,
                    },
                  ]}>
                  <Image
                    style={addFoodStyles.cardImage}
                    source={require('../assets/images/cateogories/dinner.png')}
                  />
                  <Text style={[{ color: colors.primary, marginBottom: 5 }]}>
                    Dinner
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={addFoodStyles.formInputsView}>
            <Text
              style={[
                { color: colors.secondaryBackground },
                addFoodStyles.formLabels,
              ]}>
              Product Description*
            </Text>
            <TextInput
              style={[
                addFoodStyles.formBigInput,
                {
                  borderColor: colors.secondaryBackground,
                  color: colors.primary,
                },
              ]}
              placeholderTextColor={colors.primary}
              value={productdesc}
              onChangeText={setProductDesc}
              multiline={true}
              numberOfLines={4}
            />
          </View>
          <View style={{ width: '100%', marginTop: 15 }}>
            <Text
              style={[
                { color: colors.secondaryBackground },
                addFoodStyles.formLabels,
              ]}>
              Product Image*
            </Text>
            <TouchableOpacity
              style={addFoodStyles.imageUploadTopacity}
              onPress={selectImage}>
              {imageSource !== undefined ? (
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                  }}>
                  <Image
                    style={{ width: '100%', borderRadius: 10, height: 200 }}
                    source={{ uri: imageSource }}
                  />
                </View>
              ) : (
                <View style={addFoodStyles.imageView}>
                  <Image
                    source={require('../assets/images/plus.png')}
                  />
                </View>
              )}
            </TouchableOpacity>
            <View style={{ width: '100%', marginTop: 5 }}>
              {
                uploading ? (<ProgressBar progress={transferred} color="#41179F" />) : (<Text>Hi</Text>)
              }
            </View>
          </View>
          <View style={addFoodStyles.formInputsView}>
            <Text
              style={[
                { color: colors.secondaryBackground },
                addFoodStyles.formLabels,
              ]}>
              Price*
            </Text>
            <TextInput
              style={[
                addFoodStyles.formInputs,
                {
                  borderColor: colors.secondaryBackground,
                  color: colors.primary,
                },
              ]}
              placeholderTextColor={colors.primary}
              value={price}
              onChangeText={setPrice}
              keyboardType={'numeric'}
            />
          </View>
          <View style={addFoodStyles.formInputsView}>
            <Text
              style={[
                { color: colors.secondaryBackground },
                addFoodStyles.formLabels,
              ]}>
              Size*
            </Text>
            <TextInput
              style={[
                addFoodStyles.formInputs,
                {
                  borderColor: colors.secondaryBackground,
                  color: colors.primary,
                },
              ]}
              placeholderTextColor={colors.primary}
              value={size}
              onChangeText={setSize}
            />
          </View>
          <View style={addFoodStyles.formInputsView}>
            <Text
              style={[
                { color: colors.secondaryBackground },
                addFoodStyles.formLabels,
              ]}>
              Delievery Charges*
            </Text>
            <TextInput
              style={[
                addFoodStyles.formInputs,
                {
                  borderColor: colors.secondaryBackground,
                  color: colors.primary,
                },
              ]}
              placeholderTextColor={colors.primary}
              value={delieveryfee}
              onChangeText={setDelieveryFee}
              keyboardType={'numeric'}
            />
          </View>
          <View>
            {
                    !isFormSubmitting ?
                    <TouchableOpacity
              style={[
                { backgroundColor: colors.primaryBackground },
                addFoodStyles.submitBtn,
              ]}
              onPress={() => {
                if (productName.length === 0 || productdesc.length === 0 || price.length === 0 || delieveryfee.length === 0 || size.length === 0 || imageSource === undefined || category.length === 0) {
                  Alert.alert("Error! Empty fields")
                  return
                }
                if (!(/^-?\d+$/.test(delieveryfee))) {
                  Alert.alert('Fee must be a number')
                  return
                }
                if (!(/^-?\d+$/.test(price))) {
                  Alert.alert('Price must be a number')
                  return
                }
                setIsFormSubmitting(true)
                if (btn) updateFood()
                else addFood()
                setIsFormSubmitting(false)
              }}
            >
              <Text
                style={[{ color: colors.primaryText }, addFoodStyles.submitText]}>
                {
                  btn ? "Update Food" : "Add Food"
                }
              </Text>
            </TouchableOpacity>
                    : <CustomActivityIndicator />
                }
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const addFoodStyles = StyleSheet.create({
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

  addTitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },

  formInputsView: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 20,
  },

  formLabels: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  formInputs: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
  },

  formBigInput: {
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    fontSize: 16,
  },

  twoRows: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 5,
  },

  rowOne: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'space-between',
  },

  rowTwo: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },

  touchableCategory: {
    width: '30%',
  },

  categoryCard: {
    width: '100%',
    paddingTop: 10,
    height: 105,
    alignItems: 'center',
    elevation: 2,
    borderRadius: 5,
  },

  cardImage: {
    width: '80%',
    height: 70,
  },

  imageUploadTopacity: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  imageView: {
    backgroundColor: '#EBEBEB',
    width: '100%',
    height: 200,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },

  submitBtn: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    borderRadius: 30,
  },

  submitText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default AddFood;
