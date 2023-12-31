import {View, Text, Image, TouchableOpacity} from 'react-native'
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import storage from '@react-native-firebase/storage'
import CustomActivityIndicator from './CustomActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function ProfileAbout({user, navigation}) {
    const {colors} = useTheme()

    return (
        <View style={{marginTop: 32}}>
            <View style={{marginBottom: 24}}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{color: colors.primary, fontWeight: 'bold'}}>Delievering to  </Text>
                    <Image style={{width: 22, height: 22}} source={require('../resources/images/locationIcon.png')} />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{color: colors.primaryBackground}}>{user.address}</Text>
                </View>
            </View>
            <View  style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, 
                            borderBottomColor: colors.secondaryBackground, marginBottom: 16}}>
                <Text style={{color: colors.primary}}>Total Orders</Text>
                <Text style={{color: colors.primaryBackground}}>5</Text>
            </View>
            <View  style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, 
                            borderBottomColor: colors.secondaryBackground, marginBottom: 16}}>
                <Text style={{color: colors.primary}}>Reviews</Text>
                <Text style={{color: colors.primaryBackground}}>5</Text>
            </View>
            <View  style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, marginBottom: 8}}>
                <Text style={{color: colors.primary}}>Account Type</Text>
                <Text style={{color: colors.primaryBackground}}>{user.type}</Text>
            </View>
            <TouchableOpacity onPress={async () => {
                await AsyncStorage.removeItem('user')
                navigation.popToTop()
            }} style={{flexDirection: 'row', paddingBottom: 8, marginBottom: 8, marginTop: 8}}>
                <Text style={{color: colors.primaryBackground, fontSize: 16, textDecorationLine: 'underline'}}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}