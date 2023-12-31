import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';

export default function AddReviewButton({navigation, food}) {
  const {colors} = useTheme();
  return (
    <View>
      <View style={[styles.container, {color: colors.card}]}>
        <TouchableOpacity onPress={() => navigation.navigate('Add Reviews', food)}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../resources/images/maps_ugc.png')}
                style={{width: 25, height: 25, marginRight: 10}}></Image>
              <TouchableOpacity
                style={styles.container1}
                onPress={() => navigation.navigate('Add Reviews', food)}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: colors.card,
                    fontSize: 16,
                  }}>
                  Add Review
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <Image
                source={require('../resources/images/arrow_forward_ios.png')}
                style={{width: 25, height: 25, marginRight: 10}}></Image>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginRight: 12,
          marginLeft: 12,
          marginTop: 10,
        }}>
        <View>
          <Text style={{fontWeight: 'bold', color: colors.primary,marginLeft:10,fontSize:16}}>
            User Reviews
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
