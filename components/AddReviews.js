import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import StarRating from './StarRating';
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import CustomActivityIndicator from './CustomActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function AddReviews({ route, navigation }) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [foodImage, setFoodImage] = useState(undefined)
  const [food, setFood] = useState(undefined)
  const [stars, setStars] = useState(1)
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  
  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }
  async function addReview() {
    const u = await getSessionUser()
    const review = {
      title: title,
      description: bodyText,
      stars: stars,
      user: u
    }
    const ManagerCollection = firestore().collection('Managers');
    try {
      const snapShot = (await ManagerCollection.get())
      const hotels = []
      let id = -1
      const ids = []
      snapShot.forEach(documentSnapshot => {
        const doc = documentSnapshot.data().hotels
        doc.forEach(h => {
          hotels.push(h)
          ids.push(documentSnapshot.id)
        })
    });
      let i = -1, j = -1;
      for (let index = 0; index < hotels.length; index++) {
        if (hotels[index].name === food.hotelName) {
          i = index
          id = ids[i]
          break
        }
      }
      if (i === -1) return
      for (let index = 0; index < hotels[i].foods.length; index++) {
        if (hotels[i].foods[index].name === food.name) {
          j = index
          break
        }
      }
      if (j === -1) return
      hotels[i].foods[j].reviews.push(review) 
      const newHotels = []
      for (let i = 0; i < hotels.length; i++) {
        if (ids[i] === id) newHotels.push(hotels[i])
      }
      const test = ManagerCollection.doc(id)
      await test.update({
        hotels: newHotels
      })
      Alert.alert("Review submitted successfully")
      navigation.navigate('Customer Home')
    } catch (error) {
      console.log(error);
    }

  }
  React.useEffect(() => {
    setFood(route.params)
    storage()
    .ref(route.params.foodImage) //name in storage in firebase console
    .getDownloadURL()
    .then(url => {
      setFoodImage(url);
    });
  }, [])
  if (foodImage === undefined) {
    return (
        <CustomActivityIndicator />
    )
}
  return (
    <ScrollView>
      <View>
        <View style={{ flexDirection: 'row', margin: 13 }}>
          <Image
            style={styles.imageStyle}
            source={{
              uri: foodImage,
            }}></Image>
          <View style={{ margin: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 ,color:colors.primary}}>
              {food.name}
            </Text>
            <Text
              style={{ fontWeight: 'bold', fontSize: 14, color: colors.card }}>
              Size : {food.size}
            </Text>
          </View>
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            marginLeft: 20,
            marginRight: 20,
          }}>
            <StarRating setStars={setStars}></StarRating>
        </View>
        <View>
          <Text style={{ margin: 10, fontWeight: 'bold', fontSize: 16 ,color:colors.primary}}>
            Set a Title for your Review
          </Text>
          <TextInput
            placeholder="Summarize Review"
            value={title}
            onChangeText={setTitle}
            style={{
              borderWidth: 2,
              padding: 10,
              borderRadius: 10,
              margin: 10,
              borderColor: colors.card,
              color: colors.primary,
              backgroundColor: colors.ternaryBackground,
            }}></TextInput>
        </View>
        <View>
          <Text style={{ margin: 10, fontWeight: 'bold', fontSize: 16,color:colors.primary }}>
            What did you like and dislike?
          </Text>
          <TextInput
            multiline
            placeholder="what should shoppers know before?"
            value={bodyText}
            onChangeText={setBodyText}
            style={{
              height: 200,
              borderWidth: 2,
              padding: 10,
              borderRadius: 10,
              margin: 10,
              borderColor: colors.card,
              color: colors.primary,
              backgroundColor: colors.ternaryBackground,
            }}></TextInput>
        </View>
        {
                    !isFormSubmitting ?
                    <TouchableOpacity style={{
                      margin: 10,
                      backgroundColor: colors.card,
                      alignItems: 'center',
                      padding: 15,
                      borderRadius: 12,
        }}
          onPress={() => {
            if (title.length <= 0) {
              Alert.alert('Set Title for your Review');
              return
            } if (bodyText.length <= 0) {
              Alert.alert('Write Something in Review Description');
              return
            }
            setIsFormSubmitting(true)
            addReview()
            setIsFormSubmitting(false)
            navigation.navigate('Reviews', food)
          }}>
          <Text style={{ color: colors.text }}>Submit Review</Text>
        </TouchableOpacity>
                    : <CustomActivityIndicator />
                }
          
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
});
