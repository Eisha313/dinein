import { View, StyleSheet, Text, Image } from "react-native"
import {Button} from 'react-native-paper'
import { useTheme } from '@react-navigation/native';


export default function LoginHome({navigation}) {
    const { colors } = useTheme();
    return (
        <View style={[customerStyles.bodyContainer, {backgroundColor: colors.background}]}>
            <View style={customerStyles.bodyInner}>
                <View style={customerStyles.container}>
                    <Text><Text style={[customerStyles.bodyHeadingMain, {color: colors.primary}]}>WELCOME TO </Text>
                    <Text style={[customerStyles.bodyHeadingMain, {color: colors.secondaryBackground}]}>DINE IN </Text></Text>
                </View>
                <View style={customerStyles.container}>
                    <Image style={{width: 100, height: 100}} 
                        source={require('../resources/images/logo.png')} />
                </View>
                <View style={{width: '90%'}}>
                    <Button onPress={() => {
                        navigation.navigate('Customer Login')
                    }} mode="contained" style={[customerStyles.primaryButton, {backgroundColor: colors.primaryBackground}]} 
                    labelStyle={customerStyles.primaryButtonText}>LOGIN AS CUSTOMER</Button>
                    <Button onPress={()=> {
                        navigation.navigate('Manager Login')
                    }} mode="contained" style={[customerStyles.primaryButton, {backgroundColor: colors.primaryBackground}]} 
                    labelStyle={customerStyles.primaryButtonText}>LOGIN AS MANAGER</Button>
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
        justifyContent: 'center',
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