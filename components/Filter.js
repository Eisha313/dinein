import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native'
import Slider from '@react-native-community/slider';
import { useTheme } from '@react-navigation/native';
import { useState } from 'react';
import CustomSelect from './CustomSelect';
export default function Filter({minPrice, maxPrice, setMinPrice, setMaxPrice, setSize, setStars, setModalShown, modalShown}) {
    const {colors} = useTheme()

    const foodSizes = ['Small', 'Medium', 'Large']
    const ratings = [1, 2, 3, 4, 5]
    return (
        <View style={customerStyles.bodyContainer}>
            <View style={customerStyles.bodyInner}>
                <View style={{width: '100%', marginTop: 32, marginBottom: 16}}>
                    <Text style={[customerStyles.bodyHeadingMain,{color: colors.primary}]}>Filter</Text>
                </View>
                <View style={{width: '100%', marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{color: colors.primary}}>Select Min-Price</Text>
                    <Text style={{color: colors.primaryBackground}}>Rs. {minPrice}</Text>
                </View>
                <View style={{width: '100%', marginBottom: 8}}>
                    <Slider
                        style={{width: '100%', height: 40}}
                        minimumValue={0}
                        maximumValue={10000}
                        step={500}
                        onValueChange={(v) => setMinPrice(v)}
                        minimumTrackTintColor={colors.primaryBackground}
                        maximumTrackTintColor={colors.secondaryBackground}
                        thumbImage={require('../resources/images/sliderImage.png')}
                    />
                </View>
                <View style={{width: '100%', marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{color: colors.primary}}>Select Max-Price</Text>
                    <Text style={{color: colors.primaryBackground}}>Rs. {maxPrice}</Text>
                </View>
                <View style={{width: '100%', marginBottom: 8}}>
                    <Slider
                        style={{width: '100%', height: 40}}
                        minimumValue={0}
                        maximumValue={10000}
                        step={500}
                        onValueChange={(v) => setMaxPrice(v)}
                        minimumTrackTintColor={colors.primaryBackground}
                        maximumTrackTintColor={colors.secondaryBackground}
                        thumbImage={require('../resources/images/sliderImage.png')}
                    />
                </View>
                <View style={{width: '100%', marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{color: colors.primary}}>Select Food Size</Text>
                    <CustomSelect list={foodSizes} setItem={setSize} />
                </View>
                <View style={{width: '100%', marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{color: colors.primary}}>Select Rating</Text>
                    <CustomSelect list={ratings} setItem={setStars} />
                </View>
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16}}>
                    <TouchableOpacity onPress={() => {

                    }} style={{backgroundColor: colors.secondaryBackground, paddingTop: 8, paddingBottom: 8,
                    paddingLeft: 48, paddingRight: 48, borderRadius: 15}}>
                        <Text style={{color: colors.secondaryText, fontSize: 16}}>RESET</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setModalShown(false)
                    }} style={{backgroundColor: colors.primaryBackground, paddingTop: 8, paddingBottom: 8,
                    paddingLeft: 48, paddingRight: 48, borderRadius: 15}}>
                        <Text style={{color: colors.primaryText, fontSize: 16}}>APPLY</Text>
                    </TouchableOpacity>
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
        width: '90%',
        flexDirection: 'column',
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

