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
function HotelRegistration({ navigation, route}) {
  const { colors } = useTheme();
  const [hotelName, setHotelName] = useState('');
  const [hotelAddr, setHotelAddr] = useState('');
  const [hotelEmail, setHotelEmail] = useState('');
  const [hotelContact, setHotelContact] = useState('');
  const [hotelDesc, setHotelDesc] = useState('')
  const [imageSource, setImageSource] = useState(undefined);
  const [latitude, setLatitude] = useState(33.6844);
  const [longitude, setLongitude] = useState(73.0479);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [btn, setBtn] = useState(false)
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }
  async function addHotel() {
    const imageUrl = await uploadImage(imageSource);
    const user = await getSessionUser()
    await firestore().collection('Managers').doc(user.id).update({
      hotels: firebase.firestore.FieldValue.arrayUnion({ name: hotelName, address: hotelAddr, email: hotelEmail, contact: hotelContact, description: hotelDesc, hotelImage: imageUrl, latitude: latitude, longitude: longitude, foods: [] })
    })
      .then(() => {
        alert('You hotel is LIVE');
      });


    setHotelName('');
    setHotelAddr('');
    setHotelEmail('');
    setHotelContact('');
    setHotelDesc('');
    setImageSource(undefined);
    navigation.navigate('Hotels List')
  }

  const updateHotel = async () => {
    const compHotel = route.params.particularHotel;
    console.log(compHotel)
    const imageUrl = await uploadImage(imageSource);
    const ManagerCollection = firestore().collection('Managers');
    try {
      const user = await getSessionUser()
      const ManagerCollectionData = (await ManagerCollection.doc(user.id).get()).data(); //getting collection data
      const hotelUpdatedObject = { name: hotelName, address: hotelAddr, email: hotelEmail, contact: hotelContact, description: hotelDesc, hotelImage: imageUrl, latitude: latitude, longitude: longitude};
      const hotels = ManagerCollectionData.hotels //getting hotels from data
      let hotelIndex;
      for (let index = 0; index < hotels.length; index++) {
        if (ManagerCollectionData.hotels[index].name.toString() === compHotel.toString()) {
          hotelIndex = index
          
        }
      }
      const foods = hotels[hotelIndex].foods;
      hotels[hotelIndex] = hotelUpdatedObject;
      hotels[hotelIndex].foods = foods;
      const test = ManagerCollection.doc(user.id)
      await test.update({
        hotels: hotels
      })

      setHotelName('');
      setHotelAddr('');
      setHotelEmail('');
      setHotelContact('');
      setHotelDesc('');
      setImageSource(undefined);
      navigation.navigate('Hotels List')
      alert('Your Hotel is Live')

    } catch (error) {
      console.log(error);
    }
  }

  const uploadImage = async (fileSource) => {
    const filename = fileSource.substring(fileSource.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : fileSource;
    setIsFormSubmitting(true)
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

    Alert.alert(
      'Your photo has been uploaded to Firebase Cloud Storage!'
    );
    return filename
  };

  useEffect(() => {
    if (route.params?.hotel) {
      const { name, address, email, contact, description } = route.params.hotel;
      setHotelName(name)
      setHotelEmail(email)
      setHotelAddr(address)
      setHotelContact(contact)
      setHotelDesc(description)
      setBtn(true)
    }
  }, [route.params?.hotel])


  const selectImage = () => {
    const options = {
      maxWidth: 1280,
      maxHeight: 720,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
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


  return (
    <View style={hotelRegStyles.bodyContainer}>
      <View style={hotelRegStyles.screenView}>
        <ScrollView>
          <View style={[hotelRegStyles.headLineView]}>
            <Text
              style={[
                { color: colors.primaryBackground },
                hotelRegStyles.headLineText,
              ]}>
              FILL IN THE FORM TO BECOME OUR PARTNER
            </Text>
          </View>
          <View style={hotelRegStyles.formInputsView}>
            <Text
              style={[
                { color: colors.secondaryBackground },
                hotelRegStyles.formLabels,
              ]}>
              Hotel Name*
            </Text>
            <TextInput
              style={[
                hotelRegStyles.formInputs,
                {
                  borderColor: colors.secondaryBackground,
                  color: colors.primary,
                },
              ]}
              placeholder="The Marvel"
              placeholderTextColor={colors.primary}
              value={hotelName}
              onChangeText={setHotelName}
            />
          </View>
          <View style={hotelRegStyles.formInputsView}>
            <Text
              style={[
                { color: colors.secondaryBackground },
                hotelRegStyles.formLabels,
              ]}>
              Hotel Address*
            </Text>
            <TextInput
              style={[
                hotelRegStyles.formInputs,
                {
                  borderColor: colors.secondaryBackground,
                  color: colors.primary,
                },
              ]}
              placeholder="221B Baker Street"
              placeholderTextColor={colors.primary}
              value={hotelAddr}
              onChangeText={setHotelAddr}
            />
          </View>
          <View style={hotelRegStyles.formInputsView}>
            <Text
              style={[
                { color: colors.secondaryBackground },
                hotelRegStyles.formLabels,
              ]}>
              Email*
            </Text>
            <TextInput
              style={[
                hotelRegStyles.formInputs,
                {
                  borderColor: colors.secondaryBackground,
                  color: colors.primary,
                },
              ]}
              placeholder="marveldelievers@gmail.com"
              placeholderTextColor={colors.primary}
              value={hotelEmail}
              onChangeText={setHotelEmail}
            />
          </View>
          <View style={hotelRegStyles.formInputsView}>
            <Text
              style={[
                { color: colors.secondaryBackground },
                hotelRegStyles.formLabels,
              ]}>
              Contact*
            </Text>
            <TextInput
              style={[
                hotelRegStyles.formInputs,
                {
                  borderColor: colors.secondaryBackground,
                  color: colors.primary,
                },
              ]}
              placeholder="+92 349 6899560"
              placeholderTextColor={colors.primary}
              value={hotelContact}
              onChangeText={setHotelContact}
            />
          </View>
          <View style={hotelRegStyles.formInputsView}>
            <Text
              style={[
                { color: colors.secondaryBackground },
                hotelRegStyles.formLabels,
              ]}>
              Image*
            </Text>
            <TouchableOpacity onPress={selectImage}>
              {imageSource !== undefined ? (
                <View style={hotelRegStyles.uploadImgViewBefore}>
                  <Image
                    style={{
                      width: '100%',
                      height: 250,
                      borderRadius: 10,
                    }}
                    source={{ uri: imageSource }}
                  />
                </View>
              ) : (
                <View style={hotelRegStyles.uploadImgView}>
                  <Image
                    style={{}}
                    source={require('../assets/images/uploadIcon.png')}
                  />
                  <Text
                    style={[
                      { color: colors.secondaryBackground },
                      hotelRegStyles.formLabels,
                    ]}>
                    Choose File
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={{ width: '100%', marginTop: 5 }}>
              {
                uploading ? (<ProgressBar progress={transferred} color="#41179F" />) : (<Text>Hi</Text>)
              }
            </View>
          </View>
          <View style={hotelRegStyles.formInputsView}>
            <Text
              style={[
                { color: colors.secondaryBackground },
                hotelRegStyles.formLabels,
              ]}>
              Product Description*
            </Text>
            <TextInput
              style={[
                hotelRegStyles.formBigInput,
                {
                  borderColor: colors.secondaryBackground,
                  color: colors.primary,
                },
              ]}
              placeholder="Write your hotel description here"
              placeholderTextColor={colors.primary}
              value={hotelDesc}
              onChangeText={setHotelDesc}
              multiline={true}
              numberOfLines={5}
            />
          </View>
          
            {
                    !isFormSubmitting ?
                    <TouchableOpacity
              style={[
                { backgroundColor: colors.primaryBackground },
                hotelRegStyles.submitBtn,
              ]} onPress={() => {
                if (hotelName.length === 0 || hotelEmail.length === 0 || hotelAddr.length === 0 || hotelDesc.length === 0 || imageSource === undefined){
                  Alert.alert("Invalid or empty data")
                  return
                }
                setIsFormSubmitting(true)
                if (btn) updateHotel()
                else addHotel()
                setIsFormSubmitting(false)
              }}>
              <Text
                style={[
                  { color: colors.primaryText },
                  hotelRegStyles.submitText,
                ]}>
                {
                  btn ? "Update Hotel" : "Add Hotel"
                }
              </Text>
            </TouchableOpacity>
                    : <CustomActivityIndicator />
                }
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
    width: '85%',
  },

  formInputsView: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 10,
  },

  formBigInput: {
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    fontSize: 16,
  },

  formLabels: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  headLineView: {
    marginTop: 15,
    flexDirection: 'column',
  },

  headLineText: {
    fontSize: 16,
    fontWeight: 'bold',
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

  uploadImgView: {
    flexDirection: 'column',
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#EDEADE',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadImgViewBefore: {
    flexDirection: 'column',
    width: '100%',
    height: 250,
    borderRadius: 10,
    backgroundColor: '#EDEADE',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconSetting: {
    width: 48,
    height: 48,
  }
});

export default HotelRegistration;
