import {useEffect, useState} from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from "react-native"
import { TextInput, Button } from "react-native-paper"
import { useTheme } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomActivityIndicator from './CustomActivityIndicator';
export default function ManagerLogin({navigation}) {
    const { colors } = useTheme();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isFormSubmitting, setIsFormSubmitting] = useState(false)

    async function AuthenticateUser() {
        setIsFormSubmitting(true)
        try{
            let userDoc = undefined
            const managers = firestore().collection('Managers')
            const snapShot = await managers.where('email', '==', email).where('password', '==', password).get()
            let userid = undefined
            snapShot.forEach(documentSnapshot => {
                userDoc = documentSnapshot.data()
                userid = documentSnapshot.id
            });
            if (userid === undefined) {
                Alert.alert('Invalid email or password')
                setIsFormSubmitting(false)
                return
            }
            //creating session
            const user = {
                id: userid,
                name: userDoc.name,
                email: userDoc.email,
                password: userDoc.password,
                address: userDoc.address,
                balance: userDoc.balance !== undefined ? userDoc.balance : 0,
                isCreditCard: userDoc.isCreditCard !== undefined ? userDoc.isCreditCard : null,
                type: userDoc.type,
                profileImage: userDoc.profileImage
            }
            await AsyncStorage.setItem('user', JSON.stringify(user))
            Alert.alert('Login successful')
            setIsFormSubmitting(false)
            navigation.navigate('Manager Navigation')
        }
        catch(e) {
            console.log(e)
        }
    }
    return (
        <View style={customerStyles.bodyContainer}>
            <View style={customerStyles.bodyInner}>
                <View style={{width: '100%', marginBottom: 16}}>
                    <Text style={[customerStyles.bodyHeadingMain, {color: colors.primary}]}>LOGIN AS MANAGER</Text>
                </View>
                <View style={{width: '100%', marginBottom: 8}}>
                    <TextInput style={[customerStyles.styledInput]} theme={{ roundness: 10 }} 
                      mode='outlined' label='Email'
                      outlineColor={colors.primaryBackground} activeOutlineColor={colors.secondaryBackground}
                      value={email} onChangeText={setEmail}
                    />
                </View>
                <View style={{width: '100%', marginBottom: 32}}>
                    <TextInput style={[customerStyles.styledInput]} theme={{ roundness: 10 }} 
                      mode='outlined' label='Password' secureTextEntry={true}
                      outlineColor={colors.primaryBackground} activeOutlineColor={colors.secondaryBackground}
                      value={password} onChangeText={setPassword}
                    />
                </View>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center'}}>
                  {
                    !isFormSubmitting ?
                  <Button mode="contained" style={[customerStyles.primaryButton, {width: '70%', backgroundColor: colors.primaryBackground}]} 
                    labelStyle={customerStyles.primaryButtonText} onPress={()=> {AuthenticateUser()}}>LOGIN</Button>
                    : <CustomActivityIndicator />
                }
                </View>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', marginBottom: 16}}>
                    <TouchableOpacity>
                        <Text style={{color: colors.primaryBackground}}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16}}>
                    <Text style={{color: colors.primary}}>Don't have an account? </Text>
                    <TouchableOpacity onPress={()=> navigation.navigate('Manager Registration')}>
                        <Text style={{color: colors.primaryBackground}}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{
                                flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                marginBottom: 16, 
                            }}>
                    <Image source={require('../resources/images/googleLogo.png')} style={{marginRight: 8}} ></Image>
                    <Text style={{color: colors.primary}}>SIGN IN</Text>
                </TouchableOpacity>
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyHeadingMain: {
        fontSize: 25,
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
        fontSize: 16,
    },
    styledInput: {
      borderRadius: 10
    }
})