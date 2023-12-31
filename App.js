import React, { useEffect, useState } from 'react'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Image, Button, TouchableOpacity, View, Text} from 'react-native'

import SplashScreen from './components/SplashScreen'
import LoginHome from './components/LoginHome'
import CustomerLogin from './components/CustomerLogin'
import ManagerLogin from './components/ManagerLogin'
import CustomerRegistration from './components/CustomerRegistration'
import CustomerHome from './components/CustomerHome'
import ViewFood from './components/ViewFood'
import ViewProfile from './components/ViewProfile'
import Cart from './components/Cart'
import Wishlist from './components/Wishlist';
import HotelFoods from './components/HotelFoods';
import MyWallet from './components/MyWallet';
import CardDetails from './components/CardDetails';
import Orders from './components/Orders';
import OrderDetails from './components/OrderDetails';
import PastOrders from './components/PastOrders';
import PastOrderDetails from './components/PastOrderDetails';
import Reviews from './components/Reviews';
import AddReviews from './components/AddReviews';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage'
import ManagerRegistration from './components/ManagerRegistration';

//Manager imports
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './managerComponents/CustomDrawer';
import HotelRegistration from './managerComponents/HotelRegistration'
import HotelsList from './managerComponents/HotelsList'
import ViewRestaurant from './managerComponents/ViewRestaurant'
import AddFood from './managerComponents/AddFood'
import FoodList from './managerComponents/FoodList'
import ViewFoodManager from './managerComponents/ViewFood'
import Ionicon from 'react-native-vector-icons/Ionicons';
const appTheme = {
  colors: {
    ...DefaultTheme.colors,
    primary: '#000000',
    background: '#ffffff',
    card: '#D1141B',
    text: '#ffffff',
    border: '#BABABA',
    notfication: 'white',
    primaryBackground: '#D1141B',
    primaryText: '#ffffff',
    secondaryBackground: '#41179F',
    secondaryText: '#ffffff'
  }
}
// function HeaderLeftComponent() {
//   return (
//     <TouchableOpacity>
//       <Image style={{width: 29, height: 23}} source={require('./resources/images/drawerIcon.png')} />
//     </TouchableOpacity>
//   )
// }

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
        console.log(e)
      }
    }
    caller()
}, [])
  return (
    <TouchableOpacity>
      <Image style={{width: 50, height: 50, borderRadius: 50, marginLeft: 4, marginRight: 4}} source={{uri: userImage}} />
    </TouchableOpacity>
  )  
}
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const disableHeaderOption = {headerShown: false}
const styledHeader = {
  headerStyle: {backgroundColor: appTheme.colors.secondaryBackground},
  headerRight: () => (
    <HeaderRightComponent />
  )
}
function CustomerHomeStack() {
  return (
    <Stack.Navigator screenOptions={styledHeader}>
      <Stack.Screen name="Customer Home" component={CustomerHome} />
      <Stack.Screen name="View Food" component={ViewFood} />
      <Stack.Screen name="Reviews" component={Reviews} />
      <Stack.Screen name="Add Reviews" component={AddReviews} />
      <Stack.Screen name="View Hotel Foods" component={HotelFoods} />
    </Stack.Navigator>
  )
}
function CustomerCartStack() {
  return (
    <Stack.Navigator screenOptions={styledHeader}>
      <Stack.Screen name="Cart" component={Cart} />
    </Stack.Navigator>
  )
}
function CustomerWishlistStack() {
  return (
    <Stack.Navigator screenOptions={styledHeader}>
      <Stack.Screen name="Wishlist" component={Wishlist} />
    </Stack.Navigator>
  )
}
function CustomerProfileStack() {
  return (
    <Stack.Navigator screenOptions={styledHeader}>
      <Stack.Screen name="View Profile" component={ViewProfile} />
      <Stack.Screen name="My Wallet" component={MyWallet} />
      <Stack.Screen name="Card Details" component={CardDetails} />
    </Stack.Navigator>
  )
}
function CustomerOrdersStack() {
  return (
    <Stack.Navigator screenOptions={styledHeader}>
      <Stack.Screen name="My Orders" component={Orders} />
          <Stack.Screen name="Order Details" component={OrderDetails} />
          <Stack.Screen name="Past Orders" component={PastOrders} />
          <Stack.Screen
            name="Past Order Details"
            component={PastOrderDetails}
          />
    </Stack.Navigator>
  )
}
function CustomerTabBar({ navigation }) {
  return (
    <View style={{backgroundColor: 'white', paddingTop: 16, paddingBottom: 16,
            flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'
    }}>
      <TouchableOpacity onPress={() => navigation.navigate('Home Stack')}>
        <Image source={require('./resources/images/bottomHome.png')} style={{width: 40, height: 40}}></Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Wishlist Stack')}>
        <Image source={require('./resources/images/bottomFavorites.png')} style={{width: 40, height: 40}}></Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Orders Stack')}>
        <Image source={require('./resources/images/bottomOrders.png')} style={{width: 40, height: 40}}></Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Cart Stack')}>
        <Image source={require('./resources/images/bottomCart.png')} style={{width: 40, height: 40}}></Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile Stack')}>
        <Image source={require('./resources/images/bottomProfile.png')} style={{width: 40, height: 40}}></Image>
      </TouchableOpacity>

    </View>
  );
}
function CustomerTabNavigation() {
  return (
    <Tab.Navigator tabBar={CustomerTabBar} screenOptions={disableHeaderOption}>
      <Tab.Screen name="Home Stack" component={CustomerHomeStack} />
      <Tab.Screen name="Cart Stack" component={CustomerCartStack} />
      <Tab.Screen name="Wishlist Stack" component={CustomerWishlistStack} />
      <Tab.Screen name="Profile Stack" component={CustomerProfileStack} />
      <Tab.Screen name="Orders Stack" component={CustomerOrdersStack} />
    </Tab.Navigator>
  ) 
}

//Manager
function ManageHotels({ navigation }) {
  return (
    <Stack.Navigator initialRouteName='Hotels List' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Hotel Registration" component={HotelRegistration} />
      <Stack.Screen name="Hotels List" component={HotelsList} />
      <Stack.Screen name='View Restaurant' component={ViewRestaurant} />
      <Stack.Screen name='Add Food' component={AddFood} />
      <Stack.Screen name='Food List' component={FoodList} />
      <Stack.Screen name='View Food' component={ViewFoodManager} />
    </Stack.Navigator>
  );
}
function HomeScreen({navigation}){
  return(
    <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
      <Text style = {{color: appTheme.colors.primary}}>Home</Text>
    </View>
  )
}

function MessageScreen({navigation}){
  return(
    <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
      <Text style = {{color: appTheme.colors.primary}}>Messages</Text>
    </View>
  )
}

function SettingsScreen({navigation}){
  return(
    <View style = {{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
      <Text style = {{color: appTheme.colors.primary}}>Settings</Text>
    </View>
  )
}
const Drawer = createDrawerNavigator();
function ManagerDrawer({navigation}) {
  return (
    <Drawer.Navigator useLegacyImplementation initialRouteName="Manage Hotels" screenOptions={{
      headerStyle: { backgroundColor: appTheme.colors.secondaryBackground },
      headerRight: () => (
        <HeaderRightComponent />
      ),
      drawerLabelStyle: {marginLeft: -25, fontSize: 16},
      drawerActiveTintColor: appTheme.colors.background,
      drawerActiveBackgroundColor: appTheme.colors.secondaryBackground,
      drawerInactiveTintColor: appTheme.colors.primary,
      drawerInactiveBackgroundColor: appTheme.colors.background,
      headerTintColor: '#ffff',

    }} drawerContent={(props) => <CustomDrawer navigation={navigation} {...props} />}>
      <Drawer.Screen name = "Home" component={HomeScreen} options = {{
        drawerIcon: ({color}) => (
          <Ionicon name="home-outline" size={22} color={color}/>
        )
      }}/>
      <Drawer.Screen name = "Messages" component={MessageScreen} options = {{
        drawerIcon: ({color}) => (
          <Ionicon name="chatbox-ellipses-outline" size={22} color={color}/>
        )
      }}/>
      <Drawer.Screen name="Manage Hotels" component={ManageHotels} options = {{
        drawerIcon: ({color}) => (
          <Ionicon name="business-outline" size={22} color={color}/>
        )
      }}/>
      <Drawer.Screen name = "Settings" component={SettingsScreen} options = {{
        drawerIcon: ({color}) => (
          <Ionicon name="settings-outline" size={22} color={color}/>
        )
      }}/>
    </Drawer.Navigator>
  )
}
export default function App() {
  return (
    <NavigationContainer theme={appTheme}>{
      <Stack.Navigator screenOptions={styledHeader} initialRouteName='Splash Screen'>
        <Stack.Screen options={disableHeaderOption} name="Splash Screen" component={SplashScreen} />
        <Stack.Screen options={disableHeaderOption} name="Login Home" component={LoginHome} />
        <Stack.Screen options={disableHeaderOption} name="Customer Login" component={CustomerLogin} />
        <Stack.Screen options={disableHeaderOption} name="Manager Login" component={ManagerLogin} />
        <Stack.Screen options={disableHeaderOption} name="Customer Registration" component={CustomerRegistration} />
        <Stack.Screen options={disableHeaderOption} name="Manager Registration" component={ManagerRegistration} />
        <Stack.Screen options={disableHeaderOption} name="Customer Navigation" component={CustomerTabNavigation} />
        <Stack.Screen options={disableHeaderOption} name="Manager Navigation" component={ManagerDrawer} />
      </Stack.Navigator>
    }</NavigationContainer>
  )
}