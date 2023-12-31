import {View, Image, StyleSheet} from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'

export default function CustomSelect({list, setItem}) {
    return (
        <View style={{height: 40}}>
                        <SelectDropdown
                            data={list}
                            onSelect={(selectedItem, index) => {
                                setItem(selectedItem)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem
                            }}
                            rowTextForSelection={(item, index) => {
                                return item
                            }}
                            buttonStyle={styles.dropdown2BtnStyle}
                            buttonTextStyle={styles.dropdown2BtnTxtStyle}
                            renderDropdownIcon={isOpened => {
                                return <Image style={{width: 20, height: 20}} source={require('../resources/images/dropDownIconImage.png')} />
                            }}
                            dropdownIconPosition={'right'}
                            dropdownStyle={styles.dropdown2DropdownStyle}
                            rowStyle={styles.dropdown2RowStyle}
                            rowTextStyle={styles.dropdown2RowTxtStyle}
                        />
                    </View>
    )
}

const styles = StyleSheet.create({
    shadow: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10,
    },
    header: {
      flexDirection: 'row',
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F6F6F6',
    },
    headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
    saveAreaViewContainer: {flex: 1, backgroundColor: '#FFF'},
    viewContainer: {flex: 1, backgroundColor: '#FFF'},
    scrollViewContainer: {
      flexGrow: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: '10%',
    },
    dropdownsRow: {flexDirection: 'row', width: '100%', paddingHorizontal: '5%'},
  
    dropdown1BtnStyle: {
      flex: 1,
      height: 50,
      backgroundColor: '#FFF',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#444',
    },
    dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
    dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
    dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
    dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
    divider: {width: 12},
    dropdown2BtnStyle: {
      flex: 1,
      height: 50,
      backgroundColor: '#FFF',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#444',
    },
    dropdown2BtnTxtStyle: {color: '#444', textAlign: 'left'},
    dropdown2DropdownStyle: {backgroundColor: '#EFEFEF'},
    dropdown2RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
    dropdown2RowTxtStyle: {color: '#444', textAlign: 'left'},
  });