import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native"
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
            <View style={customerStyles.bodyInner}>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', marginBottom: 8, marginTop: 16}}>
                    <Image style={{width: 100, height: 100, borderRadius: 50}} source={{uri: userImage}} />
                </View>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', marginBottom: 16}}>
                    <Text style={{color: colors.primary, fontWeight: 'bold', fontSize: 16}}>{user.name}</Text>
                </View>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', marginBottom: 32}}>
                    <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                        borderWidth: 1, borderRadius: 10, borderColor: colors.primaryBackground, padding: 8
                    }}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Image style={{width: 22, height: 22}} source={require('../resources/images/editIcon.png')} />
                            <Text style={{color: colors.primaryBackground}}>Edit Profile</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
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
                <View style={{width: '100%'}}>
                    {
                        isAboutClicked ? <ProfileAbout navigation={navigation} user={user} /> : <><View style={{marginTop: 32, alignItems: 'center'}}>
                           
                                    <TouchableOpacity style={{marginTop: 38,
                                marginRight: 17,
                                marginLeft: 17,
                                backgroundColor: colors.card,
                                alignItems: 'center',
                                padding: 15,
                                borderRadius: 12,
                                width: '100%'}} onPress={() => navigation.navigate('Card Details')}><Text style={{color: colors.primaryText}}>Add Credit Card Details</Text></TouchableOpacity>
                                
                                    <TouchableOpacity style={{marginTop: 38,
                                marginRight: 17,
                                marginLeft: 17,
                                backgroundColor: colors.card,
                                alignItems: 'center',
                                padding: 15,
                                borderRadius: 12,
                                width: '100%'}} onPress={() => navigation.navigate('My Wallet')}><Text style={{color: colors.primaryText}}>Deposit Amount</Text></TouchableOpacity>
                        </View>
                        </>
                    }
                </View>
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
        alignItems: 'center'
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