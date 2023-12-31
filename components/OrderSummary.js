import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';

export default function OrderSummary({sum}) {
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
          <Text
            style={{
              color: colors.background,
              fontWeight: 'bold',
              fontSize: 15,
              padding: 10,
            }}>
            Total
          </Text>
        </View>
        <View>
          <Text style={{color: colors.background, padding: 10,fontWeight:'bold'}}>{sum}</Text>
        </View>
      </View>
    </View>
  );
}
