import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { loggingOut } from '../API/firebaseMethods';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProfileHeader from '../components/ProfileHeader';
import PetModal from '../components/PetModal';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import PetComponent from '../components/PetComponent';

const { height } = Dimensions.get('window');




export default function Profile({ navigation }) {
  let currentUserUID = firebase.auth().currentUser.uid;
  const [name, setName] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [lines, setLines] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  const getData = useCallback(async () => {
    setError(null);
    try {
      let transformArray = [];

      const user = await firebase.auth().currentUser;

      if (user) {
        const userSnapshot = await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();

        const userdata = userSnapshot.data();
        console.log(userdata);
        setGetUser({
          username: userdata.name,
          userphoto: userdata.photo,
        });

        const dogSnapshot = await firebase
          .firestore()
          .collection("Dogs")
          .where("User", "==", user.uid)
          .get();

        dogSnapshot.forEach((res) => {
          const { Name, Breed, About, Sex, User, Birthday, Photo } = res.data();

          transformArray.push({
            id: res.id,
            Name,
            Breed,
            About,
            Sex,
            User,
            Birthday,
            Photo,
          });

          transformArray.sort((a, b) => b.id > a.id);
        });

        setDogs(transformArray);
      }
    } catch (err) {
      setError(true);
    }
  }, [setError]);

  useEffect(() => {
    async function getUserInfo() {
      let doc = await firebase
        .firestore()
        .collection('users')
        .doc(currentUserUID)
        .get();

      if (!doc.exists) {
        Alert.alert('Notandi finnst ekki, reyndu aftur.')
      } else {
        let dataObj = doc.data();
        setName(dataObj.name)
      }
    }
    getUserInfo();
  })

  const handlePress = () => {
    loggingOut();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        style="dark"
        backgroundColor={height > 850 ? "#D7D7D7" : "#FFFFFF"}
      />
      <FlatList
        keyExtractor={(item) => item.id}
        data={dogs}
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <ProfileHeader navigation={navigation} logout={logout} username={getUser.username} userphoto={getUser.userphoto} />}
        renderItem={({ item }) => {
            return (
              <>
                <PetComponent
                    Id={item.id}
                    Name={item.Name}
                    Photo={item.Photo}
                    Breed={item.Breed}
                    About={item.About}
                    Sex={item.Sex}
                    User={item.User}
                    Birthday={item.Birthday}
                    isModalVisible={isModalVisible} 
                    toggleModal={toggleModal} 
                    lines={lines}
                    setLines={setLines}
                    deleteDog={deleteDog}
                    navigation={navigation}
                />
                {/* <TouchableOpacity 
                  onPress={() => { 
                    setModalVisible(true);
                    openModal(item)
                  }}
                  activeOpacity={0.7} 
                  style={styles.dogContainer}
                >
                  <Image source={{ uri: item.Photo }} resizeMode='cover' style={styles.dogImage} />
                  <Text style={styles.dogTitle}>
                    {item.Name}
                  </Text>
                </TouchableOpacity> */}
              </>
            );
        }} 
      />
      {/* <PetModal 
        Id={dogItem.id}
        Name={dogItem.Name}
        Photo={dogItem.Photo}
        Breed={dogItem.Breed}
        About={dogItem.About}
        Sex={dogItem.Sex}
        User={dogItem.User}
        Birthday={dogItem.Birthday}
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        lines={lines}
        setLines={setLines}
        deleteDog={deleteDog}
        navigation={navigation}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  flatList: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
    marginBottom: hp(2),
  },
  dogContainer: {
    height: hp(22.5),
    backgroundColor: "white",
    width: wp(42.5),
    margin: hp(1.2),
    elevation: 2.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginBottom: hp(.8),
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: '#3FC5AB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    fontStyle: 'italic',
    marginTop: '2%',
    marginBottom: '10%',
    fontWeight: 'bold',
    color: 'black',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E6194',
  },
});