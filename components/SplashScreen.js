import {View, Text, Image, Animated} from 'react-native'
import { useState, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';


export default function SplashScreen({navigation}) {
    const { colors } = useTheme();
    let rotateAnimation = new Animated.Value(0)
    const handleAnimation = () => {
        Animated.loop(
            Animated.timing(rotateAnimation, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false,
            })
      ).start()
    };
    const interpolateRotating = rotateAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    async function callAnimation() {
        handleAnimation()
    }
    useEffect(()=> {
        callAnimation()
        const timeout = setTimeout(()=> {
            navigation.replace('Login Home')
        }, 2000)
        return () => {
            clearTimeout(timeout)
        }
    }, [])
    return (
        <View style={{flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center'}}>
            <Animated.Image style={{width: 100, height: 100, transform: [{ rotate: interpolateRotating }]}} 
                source={require('../resources/images/logo.png')} />
        </View>
    )
}