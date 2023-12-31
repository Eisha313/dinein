import { React, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
function ViewFood({navigation, route}) {
  const { colors } = useTheme();
  const {food, rating, time, image} = route.params;
  

  return (
    <View style={viewFoodStyles.bodyContainer}>
      <ScrollView style = {{width: '100%'}}>
      <View style={{ width: '100%', backgroundColor: colors.secondaryBackground, height: 200 }}></View>
      <View style={[{ backgroundColor: colors.background }, viewFoodStyles.bottomView]}>
        <View style={viewFoodStyles.imageView}>
          <Image source={{ uri: image }} style={{ width: '50%', height: 180, borderRadius: 100, borderWidth: 2}} />
        </View>
        <View style={viewFoodStyles.imageTitle}>
          <Text style={[{ color: colors.primary, fontSize: 20, fontWeight: 'bold', marginTop: 15 }]}>{food.name}</Text>
        </View>
        <View style={viewFoodStyles.hotelView}>
          <Image source={require('../assets/images/qulfi.png')} style={{ width: 24, height: 24 }} />
          <Text style={[{ color: colors.primary, fontSize: 16, marginLeft: 5 }]}>Pizza Italiano</Text>
        </View>
        <View style={[viewFoodStyles.timeAndReviews, { marginTop: 15 }]}>
          <View style={viewFoodStyles.timeContainer}>
            <Image
              source={require('../assets/images/timee.png')}
              style={{ width: 16, height: 16 }}
            />
            <Text style={[{ color: colors.secondaryBackground, fontSize: 16, fontWeight: 'bold', marginLeft: 5 }]}>{time}</Text>
            <Text style={[{ color: colors.secondaryBackground, fontSize: 16, fontWeight: 'bold', marginLeft: 5 }]}>-</Text>
          </View>
          <View style={viewFoodStyles.commentsContainer}>
            <Text style={[{ color: colors.primary, fontSize: 18, fontWeight: 'bold' }]}>{rating}</Text>
            <TouchableOpacity>
              <Text style={[{ color: colors.primary, fontSize: 16, marginLeft: 5, marginLeft: 10 }]}>[2.2k reviews] {'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={viewFoodStyles.sizeContainer}>
          <View style={[viewFoodStyles.boxSize, { borderColor: colors.secondaryBackground }]}>
            <Image
              source={require('../assets/images/criclesmall.png')}
              style={{ width: 16, height: 16 }}
            />
            <Text style={[{ color: colors.primary, fontSize: 16, marginLeft: 5, marginLeft: 10, marginTop: 10 }]}>{food.size} 8"</Text>
            <Text style={[{ color: colors.primary, fontSize: 24, fontWeight: 'bold', marginTop: 10 }]}>{food.price} Rs.</Text>
          </View>
        </View>
        <View style={[viewFoodStyles.descriptionContainer, { marginTop: 20, width: '100%', justifyContent: 'flex-start' }]}>
          <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 20, marginLeft: 30, marginBottom: 3 }}>Description</Text>
          <Text style={{ color: colors.primary, fontSize: 18, paddingHorizontal: 30}}>{food.description}</Text>
        </View>
        <View style={viewFoodStyles.delieveryContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[{ color: colors.primary, fontSize: 18, fontWeight: 'bold', paddingLeft: 32 }]}>Delievery Fee</Text>
            <Text style={[{ color: colors.primaryBackground, fontSize: 18, fontWeight: 'bold', marginLeft: 10, textDecorationColor: colors.primaryBackground, textDecorationLine: 'underline', textDecorationStyle: 'double' }]}>{food.fee} Rs.</Text>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const viewFoodStyles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  bottomView: {
    width: '100%',
    flex: 1,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    marginTop: -50,
  },

  imageView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -90,
    alignItems: 'center',
  },

  imageTitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  hotelView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    alignItems: 'center',
  },

  timeAndReviews: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  commentsContainer: {
    flexDirection: 'row',
  },

  sizeContainer: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },

  boxSize: {
    width: '35%',
    height: 110,
    borderWidth: 2,
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center'
  },

  delieveryContainer: {
    width: '100%',
    marginTop: 15,
    flexDirection: 'row',
  },

  editContainer: {
    width: 24,
    height: 24,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ViewFood;
