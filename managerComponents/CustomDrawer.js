import React, { useState, useEffect } from 'react'
import { ImageBackground, View, Image, Text } from 'react-native'
import { useTheme } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActivityIndicator from '../components/CustomActivityIndicator';
import storage from '@react-native-firebase/storage'
function CustomDrawer(props) {
    const { colors } = useTheme();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
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
                setName(u.name)
                setEmail(u.email)
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
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, paddingTop: 0, backgroundColor: colors.background }}>
                <ImageBackground source={require('../assets/images/profilebackground.png')} style={{ padding: 20, paddingBottom: 0 }}>
                    <Image source={{uri: userImage}} style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 2, borderColor: 'white', marginBottom: 10 }} />
                    <Text style={{ color: colors.primaryText, fontSize: 18, marginBottom: 5 }}>{name}</Text>
                    <Text>{email}</Text>
                    <Text></Text>
                </ImageBackground>
                <View style={{ paddingTop: 20 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 15 }}>
                    <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="share-social-outline" size={22} color="black" />
                        <Text style={{ fontSize: 16, marginLeft: 5, color: colors.primary }}>Tell a friend</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                    await AsyncStorage.removeItem('user')
                    props.navigation.popToTop()
                 }} style={{ paddingVertical: 15 }}>
                    <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="log-out-outline" size={22} color="black" />
                        <Text style={{ fontSize: 16, marginLeft: 5, color: colors.primary }}>Sign Out</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CustomDrawer