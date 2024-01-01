import {View, Text, Image, TouchableOpacity, TextInput} from 'react-native'
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import storage from '@react-native-firebase/storage'
import CustomActivityIndicator from './CustomActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function ProfileAbout({user, navigation}) {
    const {colors} = useTheme()

    return (
        <View style={{marginTop: 32}}>
            {/* <View style={{marginBottom: 24}}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{color: colors.primary, fontWeight: 'bold'}}>Delievering to  </Text>
                    <Image style={{width: 22, height: 22}} source={require('../resources/images/locationIcon.png')} />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{color: colors.primaryBackground}}>{user.address}</Text>
                </View>
            </View> */}
            <View  style={{paddingBottom: 8, marginBottom: 14}}>
                <Text style={{color: "#9796A1", fontSize: 14, marginBottom: 10, marginLeft: 5}}>Full Name</Text>
                <TextInput editable={false} style={{color: '#111719', fontSize: 16, fontWeight: 'bold', backgroundColor: '#fcfffc', borderWidth: 0.5, borderRadius: 7, padding: 14 }} value={user.name}/>
            </View>
            <View  style={{paddingBottom: 8, marginBottom: 14}}>
                <Text style={{color: "#9796A1", fontSize: 14, marginBottom: 10, marginLeft: 5}}>E-Mail</Text>
                <TextInput editable={false} style={{color: '#111719', fontSize: 16, fontWeight: 'bold', backgroundColor: '#fcfffc', borderRadius: 7, padding: 14 }} value={user.email}/>
            </View>
            <View  style={{paddingBottom: 8, marginBottom: 14}}>
                <Text style={{color: "#9796A1", fontSize: 14, marginBottom: 10, marginLeft: 5}}>Phone Number</Text>
                <TextInput editable={false} style={{color: '#111719', fontSize: 16, fontWeight: 'bold', backgroundColor: '#fcfffc', borderRadius: 7, padding: 14 }} value={user.address}/>
            </View>
            <TouchableOpacity onPress={async () => {
                await AsyncStorage.removeItem('user')
                navigation.popToTop()
            }} style={{
                backgroundColor: colors.secondaryBackground,
                borderRadius: 50,
                flexDirection: 'row',
                height: 53,
                paddingHorizontal: 8,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'flex-end'
              }}>
                <View style={{backgroundColor: '#fff', width: 40, height: 40, borderRadius: 20, resizeMode: 'contain', justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    source={require('../resources/images/logoutBtn.png')}
                  />
                </View>
                <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold', marginHorizontal: 10}}>LOGOUT</Text>
            </TouchableOpacity>
        </View>
    )
}