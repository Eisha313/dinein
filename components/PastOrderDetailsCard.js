import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {useTheme} from '@react-navigation/native';

export default function PastOrderDetailsCard({navigation, route, food}) {
  const [checked, setChecked] = useState(true);
  const {colors} = useTheme();
  return (
    <ScrollView>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row'}}>
          <CheckBox
            value={checked}
            onValueChange={newValue => setChecked(newValue)}
            style={{backgroundColor: 'white'}}
            onCheckColor={colors.card}
          />
          <Text
            style={{color: colors.primary, fontWeight: 'bold', marginTop: 7}}>
            {food.quantity}X{' '}
          </Text>
          <Text style={{color: colors.primary, marginTop: 7}}>
            {food.foodName}{' '}
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontSize: 16,
              color: colors.card,
              fontWeight: 'bold',
            }}>
            Rs. {food.price}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
