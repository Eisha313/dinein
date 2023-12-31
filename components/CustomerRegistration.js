import { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from "react-native"
import { TextInput, Button } from "react-native-paper"
import { useTheme } from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import CustomActivityIndicator from './CustomActivityIndicator';
export default function CustomerRegistration({navigation}) {
    const {colors} = useTheme()
    const [imageSource, setImageSource] = useState(undefined)
    const [isFormSubmitting, setIsFormSubmitting] = useState(false)
    const [registrationData, setRegistrationData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: ''
    })
    const [IsregistrationValid, setIsRegistrationValid] = useState({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
        address: true
    })
    const pattrens = {
        name : /[A-Za-z\s]{4,20}/,
        email: /([A-Za-z0-9\.#$]{5,})@([a-z]+)\.([a-z]+)/,
        password: /(?=.*[A-Za-z]+)(?=.*[0-9]+)(?=.*[!@#$%&^*]+)(?=.*[A-Za-z0-9!@#$%&^*]{10,})/
    }
    const selectImage = () => {
        const options = {
          maxWidth: 1280,
          maxHeight: 720,
          storageOptions: {
            skipBackup: true,
            path: 'images'
          }
        };
        launchImageLibrary(options, response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            setImageSource(response.assets[0].uri)
          }
        });
      };
      const uploadImage = async (fileSource) => {
        const filename = fileSource.substring(fileSource.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : fileSource;
        const task = storage()
          .ref(filename)
          .putFile(uploadUri);
        //file name is the path
        // task.on('state_changed', snapshot => {
        //   setTransferred(
        //     Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
        //   );
        // });
        try {
          await task;
        } catch (e) {
          console.error(e);
        }
        return filename
      };
      
    useEffect(()=> {
        setIsRegistrationValid({...IsregistrationValid, ...{
            name: pattrens['name'].test(registrationData.username),
            email: pattrens['email'].test(registrationData.email),
            password: pattrens['password'].test(registrationData.password),
            confirmPassword: registrationData.password === registrationData.confirmPassword,
            address: registrationData.address.length > 0
        }})
    }, [registrationData])
    async function registerUser(){
        setIsFormSubmitting(true)
        for (const key in IsregistrationValid){
            if (!IsregistrationValid[key]) {
                Alert.alert('Invalid information', `${key} inavlid`)
                setIsFormSubmitting(false)
                return
            }
        }
        if (imageSource === undefined) {
            Alert.alert('Please upload a profile image')
            setIsFormSubmitting(false)
            return
        }
        const customers = firestore().collection('Customers')
        //checking if user already exists
        const userExists = false
        try{
            const snapShot = await customers.where('email', '==', registrationData.email).get()
            snapShot.forEach(documentSnapshot => {
                userExists = true
            });
            if (userExists) {
                Alert.alert('User is alredy registered')
                setIsFormSubmitting(false)
                return
            }
            const image = await uploadImage(imageSource)
            const user = {
                email: registrationData.email,
                name: registrationData.name,
                password: registrationData.password,
                address: registrationData.address,
                type: 'customer',
                profileImage: image,
                wishlist: [],
                orders: []
            }
            const result = await customers.add(user)
        } catch(e) {
            Alert.alert(e)
        }
        Alert.alert('Registration successful') 
        setIsFormSubmitting(false)
        navigation.navigate('Customer Login')       
    }

    return (
        <View style={customerStyles.bodyContainer}>
            <View style={customerStyles.bodyInner}>
                <View style={{width: '100%', marginBottom: 16}}>
                    <Text style={[customerStyles.bodyHeadingMain, {color: colors.primary}]}>REGISTER AS CUSTOMER</Text>
                </View>
                <View>
                    <Button style={[{backgroundColor: colors.primaryBackground, borderRadius: 15, marginBottom: 8}]} 
                    labelStyle={{color: colors.primaryText}} onPress={()=> {selectImage()}}>Upload Picture</Button>
                </View>
                {imageSource !== undefined ? <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                    <Image style={{width: 100, height: 100, borderRadius: 50}} source={{uri: imageSource}} />                    
                </View> : <></>}
                <View style={{width: '100%'}}>
                    <View style={{width: '100%', marginBottom: 8}}>
                        <TextInput style={[customerStyles.styledInput]} theme={{ roundness: 10 }} 
                            mode='outlined' label='Name'
                            outlineColor={colors.primaryBackground} activeOutlineColor={colors.secondaryBackground}
                            value={registrationData.name} onChangeText={(text) => setRegistrationData({...registrationData, ...{name: text}})}
                        />
                    </View>
                    <View style={{width: '100%', marginBottom: 8}}>
                        <TextInput style={[customerStyles.styledInput]} theme={{ roundness: 10 }} 
                            mode='outlined' label='Email'
                            outlineColor={colors.primaryBackground} activeOutlineColor={colors.secondaryBackground}
                            value={registrationData.email} onChangeText={(text) => setRegistrationData({...registrationData, ...{email: text}})}
                        />
                    </View>
                    <View style={{width: '100%', marginBottom: 8}}>
                        <TextInput style={[customerStyles.styledInput]} theme={{ roundness: 10 }} 
                            mode='outlined' label='Password'
                            outlineColor={colors.primaryBackground} activeOutlineColor={colors.secondaryBackground}
                            value={registrationData.password} onChangeText={(text) => setRegistrationData({...registrationData, ...{password: text}})}
                        />
                    </View>
                    <View style={{width: '100%', marginBottom: 8}}>
                        <TextInput style={[customerStyles.styledInput]} theme={{ roundness: 10 }} 
                            mode='outlined' label='Re-enter Password'
                            outlineColor={colors.primaryBackground} activeOutlineColor={colors.secondaryBackground}
                            value={registrationData.confirmPassword} onChangeText={(text) => setRegistrationData({...registrationData, ...{confirmPassword: text}})}
                        />
                    </View>
                    <View style={{width: '100%', marginBottom: 24}}>
                        <TextInput style={[customerStyles.styledInput]} theme={{ roundness: 10 }} 
                            mode='outlined' label='Address'
                            outlineColor={colors.primaryBackground} activeOutlineColor={colors.secondaryBackground}
                            value={registrationData.address} onChangeText={(text) => setRegistrationData({...registrationData, ...{address: text}})}
                        />
                    </View>
                </View>
                {
                    !isFormSubmitting ?
                    <Button style={[{backgroundColor: colors.primaryBackground, width: '100%' }, customerStyles.primaryButton]} 
                    labelStyle={{color: colors.primaryText}} onPress={()=> {registerUser()}}>Submit</Button>
                    : <CustomActivityIndicator />
                }
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
        borderRadius: 20,
        marginBottom: 32,
        paddingTop: 10,
        paddingBottom: 10,
    },
    primaryButtonText: {
        fontSize: 16,
    },
    styledInput: {
      borderRadius: 10
    }
})