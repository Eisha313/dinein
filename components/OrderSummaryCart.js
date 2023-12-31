import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';

export default function OrderSummaryCart({totalPrice, totalFee}) {
  const {colors} = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.secondaryBackground,
        color: colors.background,
        margin: 20,
        borderRadius: 20,
        paddingLeft: 0,
        paddingTop: 10,
      }}>
      <Text
        style={{
          color: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.background,
          paddingLeft: 10,
          fontWeight: 'bold',
          fontSize: 16,
        }}>
        SUMMARY
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 7,
          paddingLeft: 10,
          marginBottom: 10,
          marginRight: 10,
          marginLeft: 10,
        }}>
        <View>
          <Text style={{color: colors.background}}>Sub-Total</Text>
          <Text style={{color: colors.background}}>Shipping Fee</Text>
          <Text
            style={{
              color: colors.background,
              fontWeight: 'bold',
              fontSize: 15,
            }}>
            Total
          </Text>
        </View>
        <View>
          <Text style={{color: colors.background}}>Rs. {totalPrice}</Text>
          <Text style={{color: colors.background}}>Rs. {totalFee}</Text>
          <Text
            style={{
              color: colors.background,
              fontWeight: 'bold',
              fontSize: 15,
            }}>
            Rs. {totalFee + totalPrice}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#717070',
    marginLeft: 18,
    marginRight: 18,
    marginTop: 10,
    padding: 10,
  },
  container1: {
    flexDirection: 'row',
  },
});
