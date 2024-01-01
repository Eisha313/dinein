import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import {Button} from 'react-native-paper'
import { useTheme } from '@react-navigation/native';
import { useState, useEffect } from "react";
import ProfileAbout from "./ProfileAbout";
import CustomActivityIndicator from "./CustomActivityIndicator";
import storage from '@react-native-firebase/storage'
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function ViewProfile({navigation}) {
    const { colors } = useTheme();
    const [isAboutClicked, setIsAboutClicked] = useState(true)
    const [userImage, setUserImage] = useState(undefined)
    const [user, setUser] = useState(undefined)
    async function getSessionUser() {
        const u = await AsyncStorage.getItem('user');
        const user = JSON.parse(u);
        return user;
      }
    useEffect(() => {
        async function caller() {
            const u = await getSessionUser()
            setUser(u)
            storage()
            .ref(u.profileImage) //name in storage in firebase console
            .getDownloadURL()
            .then((url) => {
              setUserImage(url);
            })
        }
        caller()
    }, [])
    if (userImage === undefined) {
        return (
            <CustomActivityIndicator />
        )
    }
    return (
        <View style={[customerStyles.bodyContainer, {backgroundColor: colors.background}]}>
            <Image
              style={{
                height: 280,
                width: '100%',
                resizeMode: 'stretch',
                borderRadius: 10,
                position: 'absolute',
                top: -10,
                left: 0,
              }}
              source={require('../resources/images/profileBg.png')}
            />
            <View style={customerStyles.bodyInner}>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', marginBottom: 8, marginTop: 16}}>
                    <Image style={{width: 125, height: 125, borderRadius: 62, borderWidth: 10, borderColor: colors.background}} source={{uri: userImage}} />
                </View>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', marginBottom: 5}}>
                    <Text style={{color: colors.primary, fontWeight: 'bold', fontSize: 20}}>{user.name}</Text>
                </View>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', marginBottom: 32}}>
                    <TouchableOpacity>
                            <Text style={{color: '#9796A1', fontSize: 14}}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}>
                    <View>
                        <TouchableOpacity style={{paddingBottom: 8, borderBottomColor: colors.primaryBackground, 
                            borderBottomWidth: isAboutClicked ? 5 : 0
                        }} onPress={() => setIsAboutClicked(true)}
                        >
                            <Text style={{color: colors.primaryBackground}}>ABOUT</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={{paddingBottom: 8, borderBottomColor: colors.primaryBackground, 
                            borderBottomWidth: !isAboutClicked ? 5 : 0
                        }} onPress={() => setIsAboutClicked(false)}
                        >
                            <Text style={{color: colors.primaryBackground}}>PAYMENTS</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={{width: '100%'}}>
                    {
                        isAboutClicked ? <ProfileAbout navigation={navigation} user={user} /> : <><View style={{marginTop: 32, alignItems: 'center'}}>
                           
                                    <TouchableOpacity style={{marginTop: 38,
                                marginRight: 17,
                                marginLeft: 17,
                                backgroundColor: colors.primaryBackground,
                                alignItems: 'center',
                                padding: 15,
                                borderRadius: 12,
                                width: '100%'}} onPress={() => navigation.navigate('Card Details')}><Text style={{color: colors.primaryText, fontWeight: 'bold', fontSize: 15}}>Add Credit Card Details</Text></TouchableOpacity>
                                
                                    <TouchableOpacity style={{marginTop: 38,
                                marginRight: 17,
                                marginLeft: 17,
                                backgroundColor: colors.primaryBackground,
                                alignItems: 'center',
                                padding: 15,
                                borderRadius: 12,
                                width: '100%'}} onPress={() => navigation.navigate('My Wallet')}><Text style={{color: colors.primaryText, fontWeight: 'bold', fontSize: 15}}>Deposit Amount</Text></TouchableOpacity>
                        </View>
                        </>
                    }
                </ScrollView>
            </View>
        </View>
    )
}
const customerStyles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    bodyInner: {
        width: '85%',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 100
    },
    bodyHeadingMain: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    container: {
        marginBottom: 48
    },
    primaryButton: {
        borderRadius: 50,
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 32
    },
    primaryButtonText: {
        fontSize: 20
    }
})