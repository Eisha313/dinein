import {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
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
import storage from '@react-native-firebase/storage'

function HeaderRightComponent() {
  const [userImage, setUserImage] = useState(undefined)
  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    if (u === null) {
      return undefined
    }
    const user = JSON.parse(u);
    return user;
  }
useEffect(() => {
    async function caller() {
      try{
          const u = await getSessionUser()
          if (u === undefined) return
          storage()
          .ref(u.profileImage) //name in storage in firebase console
          .getDownloadURL()
          .then((url) => {
            setUserImage(url);
          })
      } catch(e) {
        console.log("na")
      }
    }
    caller()
}, [])
  return (
    <TouchableOpacity>
      <Image style={{width: 40, height: 40, borderRadius: 10, marginLeft: 4, marginRight: 4}} source={{uri: userImage}} />
    </TouchableOpacity>
  )  
}
export default function Wishlist({navigation}) {
  const [activeButton, setActiveButton] = useState('foodItems');

  const handlePressIn = (buttonType) => {
    setActiveButton(buttonType);
  };

  const handlePressOut = () => {
    setActiveButton('foodItems');
  };
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
    <View style={customerStyles.bodyContainer}>
      <View style={customerStyles.bodyInner}>
        <View style={{marginTop: 30, width: '100%'}}>
          <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', width: '100%'}}>
            <View style={{width: 40, height: 40}}/>
            <Text
              style={[
                {color: colors.primary, fontWeight: 'bold', fontSize: 20, textAlign: 'center'},
              ]}> Favourites</Text>
            <HeaderRightComponent/>
          </View>
          <View style={{marginTop: 40}}>
            <View style={styles.btnTop}>
            <TouchableHighlight
              style={[
                styles.btn,
                {
                  backgroundColor: activeButton === 'foodItems' ? colors.primaryBackground : 'transparent',
                },
              ]}
              onPress={() => console.log('Food Items pressed')}
              onPressIn={() => handlePressIn('foodItems')}
              onPressOut={handlePressOut}
              underlayColor={colors.primaryBackground}
            >
              <Text style={{ color: activeButton === 'foodItems' ? colors.background : colors.primaryBackground }}>
                Food Items
              </Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={[
                styles.btn1,
                {
                  backgroundColor: activeButton === 'restaurants' ? colors.primaryBackground : 'transparent',
                },
              ]}
              onPress={() => console.log('Restaurants pressed')}
              onPressIn={() => handlePressIn('restaurants')}
              onPressOut={handlePressOut}
              underlayColor={colors.primaryBackground}
            >
              <Text style={{ color: activeButton === 'restaurants' ? 'white' : colors.primaryBackground }}>
                Restaurants
              </Text>
            </TouchableHighlight>
            </View>
            <ScrollView>
              <FoodCardList navigation={navigation} foods={foods} />
            </ScrollView>
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

const styles = StyleSheet.create({
  btn: {
    borderRadius: 30,
    alignItems: 'center',
    width: '50%',
    padding: 15,
    margin: 2,
  },
  btn1: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    padding: 15,
  },
  btnTop: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 40,
    justifyContent: 'center',
    borderRadius: 40,
  },
});