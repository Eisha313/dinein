import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import storage from '@react-native-firebase/storage'
import CustomActivityIndicator from './CustomActivityIndicator';
import uuid from 'react-native-uuid';

export default function ReviewCard({review}) {
  const {colors} = useTheme();
  const[img,setImg]=useState();
  useEffect(() => {
    storage()
    .ref(review.user.profileImage) //name in storage in firebase console
    .getDownloadURL()
    .then((url) => {
      setImg(url);
  })
  }, []);

  const array1 = [];
  const array2 = [];
  for (var i = 1; i <= Math.ceil(review.stars); i++) {
    array1.push(0);
  }
  for (var i = Math.ceil(review.stars + 1); i <= 5; i++) {
    array2.push(0);
  }
  if (img === undefined) {
    return (
        <CustomActivityIndicator />
    )
}
  return (
    <View style={[styles.container, {borderColor: colors.card}]}>
      <TouchableOpacity style={styles.container1}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={styles.imageStyle}
              source={{uri: img}}></Image>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: colors.primary,
                }}>
                {review.user.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
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
            </View>
          </View>
          <Text
            style={{
              fontWeight: 'bold',
              marginBottom: 6,
              color: colors.primary,
            }}>
            {review.title}
          </Text>
          <Text style={{color: colors.primary}}>{review.description}</Text>
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
    marginTop: 15,
    padding: 8,
  },
  container1: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    height: 50,
    width: 50,
    borderRadius: 62,
    marginRight: 5,
  },
  img: {
    width: 15,
    height: 15,
  },
});
