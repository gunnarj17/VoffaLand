import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Platform, ScrollView, Alert, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import { ActionSheetCustom as ActionSheet } from '@alessiocancian/react-native-actionsheet';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
import 'firebase/firestore';
import 'firebase/auth';

const { height } = Dimensions.get('window');

export default function AddEventScreen({ navigation }) {
  let actionSheet = useRef();

  const [getPark, setGetPark] = useState([]);
  const [getEvent, setGetEvent] = useState([]);

  const [photoURL, setPhotoURL] = useState(null);
  const [park, setPark] = useState(null);
  const [event, setEvent] = useState(null);
  const [date, setDate] = useState(new Date(1598051730000));
  const [description, setDescription] = useState('');

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [isFetching, setIsFetching] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') {
      setShow(false);
    }
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = (dateMode) => {
    showMode(dateMode);
  };

  const optionArray = [
    <View style={styles.flexDirectionRow}>
      <Ionicons name="ios-camera" size={hp(3)} color="gray" />
      <Text style={{ ...styles.actionSheetOptions, marginLeft: wp(1.5) }}>Camera</Text>
    </View>
    ,
    <View style={styles.flexDirectionRow}>
      <MaterialIcons name="perm-media" size={hp(3)} color="gray" />
      <Text style={{ ...styles.actionSheetOptions, marginLeft: wp(1.8) }}>Gallery</Text>
    </View>,
    'Cancel'
  ];

  const showActionSheet = () => {
    actionSheet.current.show();
  };

  const getData = async () => {
    try {

      let transformParkArray = [];
      let transformEventArray = [];

      const parkSnapshot = await firebase.firestore().collection('Parks').get();
      const eventSnapshot = await firebase.firestore().collection('Events').get();

      parkSnapshot.forEach((res) => {

        const { Name } = res.data();

        transformParkArray.push({ label: Name, value: Name });

      });

      eventSnapshot.forEach((res) => {

        const { name, photo } = res.data();

        transformEventArray.push({ photo, label: name, value: name });

      });

      setGetPark(transformParkArray);
      setGetEvent(transformEventArray);
    } catch (err) {
      Alert.alert(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const galleryPermissions = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        return status;
      }
    } catch (err) {
      throw err;
    }
  };

  const cameraPermissions = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        return status;
      }
    } catch (err) {
      throw err;
    }
  };

  const pickImageGallery = async () => {
    try {
      const status = await galleryPermissions();

      if (status !== 'granted') {
        return Alert.alert('Sorry, we need camera roll permissions to make this work!');
      };

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });

      if (!result.cancelled) {
        setPhotoURL(result.uri);
      }
    } catch (err) {
      Alert.alert(err.message);
    }
  };

  const pickImageCamera = async () => {
    try {
      const status = await cameraPermissions();

      if (status !== 'granted') {
        return Alert.alert('Sorry, we need camera roll permissions to make this work!');
      };

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });

      if (!result.cancelled) {
        setPhotoURL(result.uri);
      }
    } catch (err) {
      Alert.alert(err.message);
    }
  };

  const onsubmit = async () => {
    if (event == null || park == null || description == '' || photoURL == null) {
      Alert.alert('fields are empty. Fill the fields.');
    } else {
      setIsFetching(true);
      try {

        const user = await firebase.auth().currentUser;

        if (user) {

          await firebase.firestore().collection('UserEvents').add({
            park,
            event,
            date,
            photo: photoURL,
            description,
            user: user.uid
          });

          Alert.alert('Events added successfully');

          setIsFetching(false);

        }

        navigation.goBack();
      } catch (err) {
        setIsFetching(false);
        Alert.alert(err.message);
      }
    }
  };

  const changeEvent = (val) => {
    setEvent(val);
    const filter = getEvent.find(i => i.value === val);

    if (filter != undefined) {
      setPhotoURL(filter.photo)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={height > 850 ? '#D7D7D7' : '#FFFFFF'} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={{ marginTop: hp(6), flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: hp(.7), marginLeft: wp(8) }}>
              <Ionicons name="chevron-back" size={hp(3)} color="black" />
            </TouchableOpacity>
            <Text style={{ fontSize: hp(2.8), marginLeft: wp(22) }}>
              Nýr viðburður
            </Text>
          </View>
          {photoURL ?
            <View activeOpacity={0.5} style={{ width: wp(100), height: hp(25), backgroundColor: '#f2f2f2', marginTop: hp(5) }}>
              <Image
                source={{
                  uri: photoURL
                }}
                style={{ flex: 1, width: null, height: null }}
              />
            </View>
            :
            <View activeOpacity={0.5} style={{ width: wp(100), height: hp(25), backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center', marginTop: hp(5) }}>
              <Entypo name="camera" size={hp(11)} color="#DBDDD8" />
              <Text style={{ fontSize: hp(2.7) }}>
                Velja mynd
              </Text>
            </View>
          }
          <View style={{ width: wp(85), alignSelf: 'center', marginTop: hp(4) }}>
            <Text style={{ fontSize: hp(2.7) }}>
              Heiti viðburðar
            </Text>
            <RNPickerSelect
              placeholder={{
                label: '-- Ekkert valið --',
                value: null,
                color: '#00000',
              }}
              onValueChange={(value) => changeEvent(value)}
              items={getEvent}
              useNativeAndroidPickerStyle={false}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: hp(4.6),
                  right: 16,
                },
                placeholder: {
                  color: 'black',
                  fontSize: 14,
                  fontWeight: 'bold',
                },
              }}
              Icon={() => {
                return (
                  <View
                    style={{
                      backgroundColor: 'transparent',
                      borderTopWidth: 10,
                      borderTopColor: 'gray',
                      borderRightWidth: 10,
                      borderRightColor: 'transparent',
                      borderLeftWidth: 10,
                      borderLeftColor: 'transparent',
                      width: 0,
                      height: 0,
                    }}
                  />
                );
              }}
            />
          </View>
          <View style={{ width: wp(85), alignSelf: 'center', marginTop: hp(3) }}>
            <Text style={{ fontSize: hp(2.7) }}>
              Staðsetning
            </Text>
            <RNPickerSelect
              placeholder={{
                label: '-- Ekkert valið --',
                value: null,
                color: '#00000',
              }}
              onValueChange={(value) => setPark(value)}
              items={getPark}
              useNativeAndroidPickerStyle={false}
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: hp(4.6),
                  right: 16,
                },
                placeholder: {
                  color: 'black',
                  fontSize: 14,
                  fontWeight: 'bold',
                },
              }}
              Icon={() => {
                return (
                  <View
                    style={{
                      backgroundColor: 'transparent',
                      borderTopWidth: 10,
                      borderTopColor: 'gray',
                      borderRightWidth: 10,
                      borderRightColor: 'transparent',
                      borderLeftWidth: 10,
                      borderLeftColor: 'transparent',
                      width: 0,
                      height: 0,
                    }}
                  />
                );
              }}
            />
          </View>
          <View style={{ width: wp(85), alignSelf: 'center', marginTop: hp(3) }}>
            <Text style={{ fontSize: hp(2.7) }}>
              Dagsetning
            </Text>
            <TouchableOpacity onPress={() => showDatepicker('date')} style={{ alignSelf: 'center', backgroundColor: 'white', elevation: 5, borderRadius: 8, marginTop: hp(5) }}>
              <Text style={{ fontSize: hp(2.2), padding: 10, paddingHorizontal: 20 }}>
                Pick Date
              </Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>
              {date.toLocaleDateString()}
            </Text>
            <TouchableOpacity onPress={() => showDatepicker('time')} style={{ alignSelf: 'center', backgroundColor: 'white', elevation: 5, borderRadius: 8, marginTop: hp(3) }}>
              <Text style={{ fontSize: hp(2.2), padding: 10, paddingHorizontal: 20 }}>
                Pick Time
              </Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>
              {date.toLocaleTimeString()}
            </Text>
          </View>
          <View style={{ width: wp(85), alignSelf: 'center', marginTop: hp(3) }}>
            <Text style={{ fontSize: hp(2.7) }}>
              Nánari lýsing
            </Text>
            <TextInput
              autoCorrect={false}
              multiline={true}
              value={description}
              onChangeText={(e) => setDescription(e)}
              style={{ marginTop: hp(2), borderWidth: 1, height: hp(20), paddingLeft: 8, paddingTop: 10, borderRadius: 15, textAlignVertical: 'top' }}
            />
          </View>
          <View style={{ flexDirection: 'row', width: wp(90), justifyContent: 'space-evenly', alignSelf: 'center', marginTop: hp(4), marginBottom: hp(4) }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#C35C5C', borderRadius: 20, elevation: 2 }}>
              <Text style={{ fontSize: hp(2.4), padding: 10, color: 'white', paddingHorizontal: 20 }}>
                Hætta við
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onsubmit} style={{ backgroundColor: '#034B42', borderRadius: 20, elevation: 2 }}>
              <Text style={{ fontSize: hp(2.4), padding: 10, color: 'white', paddingHorizontal: 15 }}>
                Stofna viðburð
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ActionSheet
        ref={actionSheet}
        title={<Text style={styles.actionSheetTitle}>Add Photo</Text>}
        options={optionArray}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => {
          if (index == 0) {
            pickImageCamera()
          } else if (index == 1) {
            pickImageGallery()
          } else { }
        }}
        styles={{
          titleBox: { height: 70 },
          buttonBox: { height: 55 }
        }}
      />
      {show && (
        Platform.OS === 'android' ?
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display='default'
            onChange={onChange}
          />
          :
          <Modal isVisible={Platform.OS == 'android' ? false : show} backdropColor="transparent" onBackdropPress={() => setShow(false)}>
            <View style={styles.DateTimePickerView}>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display='spinner'
                onChange={onChange}
              />
            </View>
          </Modal>
      )}
      <Modal isVisible={isFetching}>
        {Platform.OS === 'android' ?
          <StatusBar backgroundColor='rgba(0,0,0,0.5)' />
          : null
        }
        <View style={styles.indicator}>
          <ActivityIndicator size='large' color='white' />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  actionSheetTitle: {
    fontSize: hp(2.6),
    fontWeight: 'bold',
    color: '#0B666B',
  },
  actionSheetOptions: {
    fontSize: hp(2.4),
    fontWeight: 'bold',
    color: 'gray'
  },
  flexDirectionRow: {
    flexDirection: 'row'
  },
  DateTimePickerView: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'green'
  },
  dateText: {
    textAlign: 'center',
    marginTop: hp(2.5),
    fontWeight: 'bold'
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    color: 'black',
    paddingRight: 30,
    marginTop: hp(2)
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    color: 'black',
    paddingRight: 30,
    marginTop: hp(2)
  }
});