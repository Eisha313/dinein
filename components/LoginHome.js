import { View, StyleSheet, Text, Image } from "react-native"
import {Button} from 'react-native-paper'
import { useTheme } from '@react-navigation/native';


export default function LoginHome({navigation}) {
    const { colors } = useTheme();
    return (
        <View style={[customerStyles.bodyContainer, ]}>
            <View style={customerStyles.bodyInner}>
                <View style={customerStyles.container}>
                    
                    <Text style={customerStyles.bodyHeadingMain}>
                        <Text style={ {color: colors.secondary}}>Food </Text>

                    <Text style={ {color: colors.secondaryBackground,marginLeft:20}}>HUB </Text></Text>
                </View>
                {/* <View style={customerStyles.container}>
                    <Image style={{width: 100, height: 100}} 
                        source={require('../resources/images/logo.png')} />
                </View> */}
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
        justifyContent: 'center',
        backgroundColor:"#1f3c2e"
        
    },
    bodyInner: {
        width: '90%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyHeadingMain: {
        fontSize: 35,
        fontWeight: 'bold',
        justifyContent:'center',
        alignItems:'center'
    },
    container: {
        marginBottom: 48,
        backgroundColor:"black",
        height: 140,
        width:110,
        mariginTo:40,
        justifyContent:'center',
        alignItems:'center'
        
       
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