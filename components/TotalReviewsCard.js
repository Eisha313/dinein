import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import uuid from 'react-native-uuid';

export default function TotalReviewsCard({rating,totalReviews}) {
  const {colors} = useTheme();
  const array1 = [];
  const array2 = [];
  var rating1 = Math.ceil(rating);
  for (var i = 1; i <= rating1; i++) {
    array1.push(0);
  }
  for (var i = rating1 + 1; i <= 5; i++) {
    array2.push(0);
  }
  return (
    <View style={[styles.container, {borderColor: colors.card}]}>
      <TouchableOpacity style={styles.container1}>
        <View>
          <Text
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              textAlign: 'center',
              color: colors.primary,
            }}>
            {rating}/5
          </Text>
          <Text
            style={{
              color: '#717070',
              margin: 10,
              textAlign: 'center',
              color: colors.primary,
            }}>
            Based on {totalReviews} Reviews
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 5,
          }}>
          {array1.map(n => {
            return (
              <Image key={uuid.v4()}
                style={styles.img}
                source={require('../resources/images/star_filled.png')}></Image>
            );
          })}
          {array2.map(n => {
            return (
              <Image key={uuid.v4()}
                style={styles.img}
                source={require('../resources/images/star_corner.png')}></Image>
            );
          })}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 25,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    padding: 30,
  },
  container1: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 30,
    height: 30,
  },
});
