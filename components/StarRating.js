import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import uuid from 'react-native-uuid';

export default function StarRating({setStars}) {
  const {colors} = useTheme();
  const [defaultRating, setDefaultRating] = useState(1);
  const [starRating, setStarRating] = useState([1, 2, 3, 4, 5]);

  const starImgFilled =
    'https://raw.githubusercontent.com/tranhonghan/images/main/star_filled.png';
  const starImgCorner =
    'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png';
  return (
    <SafeAreaView>
      <View style={[styles.container,{backgroundColor:colors.background}]}>
        <Text style={styles.heading}>Your overall rating for this product</Text>
        <View style={styles.rating}>
          {starRating.map((item, key) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={item}
                onPress={() => {
                  setDefaultRating(item);
                  setStars(item)
                }}>
                <Image
                  style={styles.img}
                  source={
                    item <= defaultRating
                      ? {uri: starImgFilled}
                      : {uri: starImgCorner}
                  }></Image>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  heading: {
    fontSize: 16,
    marginBottom: 10,
    color: '#717070',
  },
  rating: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  img: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
});
