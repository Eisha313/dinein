import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useTheme} from '@react-navigation/native';
import TotalReviewsCard from './TotalReviewsCard';
import AddReviewButton from './AddReviewButton';
import ReviewCard from './ReviewCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

export default function Reviews({navigation, route}) {
  const {colors} = useTheme();
  const [food, setFood] = useState(route.params)
  const [reviews, setReviews] = useState(route.params.reviews);
  const [rating, setRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  useEffect(() => {
    //getting hotel reviews
    let reviewCount = 0;
    let totalStars = 0;
    reviews.forEach(r => {
      totalStars += r.stars;
      reviewCount++;
    });
    if (reviewCount === 0) setRating(0);
    else setRating(totalStars / reviewCount);
    setTotalReviews(reviewCount);
  }, []);

  async function getSessionUser() {
    const u = await AsyncStorage.getItem('user');
    const user = JSON.parse(u);
    return user;
  }
  return (
    <ScrollView>
      <View>
        <View style={{width: '100%'}}>
          <TotalReviewsCard
            rating={rating}
            totalReviews={totalReviews}></TotalReviewsCard>

          <AddReviewButton navigation={navigation} food={food}></AddReviewButton>
        </View>
        <View style={{width: '100%'}}>
          {reviews.map(review => {
            return (
              <ReviewCard key={uuid.v4()} review={review} navigation={navigation}></ReviewCard>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
