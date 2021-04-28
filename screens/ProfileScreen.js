import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProfileHeader from '../components/ProfileHeader';
import PetModal from '../components/PetModal';
import * as firebase from 'firebase';
import { loggingOut } from '../API/firebaseMethods';
import 'firebase/firestore';
import 'firebase/auth';

const { height } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {

export default function Profile({ navigation }) {
  let currentUserUID = firebase.auth().currentUser.uid;
  const [name, setName] = useState('');
  const [dogs, setDogs] = useState([]);
  const [dogItem, setDogItems] = useState({});
  const [getUser, setGetUser] = useState({});

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

        const userSnapshot = await firebase.firestore().collection('users').doc(user.uid).get();

          const userdata = userSnapshot.data();

          setGetUser({
            username: userdata.name,
            userphoto: userdata.photo
          });

        const dogSnapshot = await firebase.firestore().collection('Dogs').where("User", "==", user.uid).get();

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
            Photo
          });

          transformArray.sort((a,b) => b.id > a.id);

        });

        setDogs(transformArray);

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

    } catch (err) {
      setError(true);
    }
    getUserInfo();
  })
  }, [setError]);

  useEffect(() => {
    setIsFetching(true);
    getData().then(() => {
        setIsFetching(false);
    });
  }, [getData, setIsFetching]);

  const handlePress = () => {
    loggingOut();
    navigation.replace('Home');
  if (isFetching) {
    return (
      <View style={styles.indicator}>
        <StatusBar style="dark"  backgroundColor={height > 850 ? '#D7D7D7' : '#FFFFFF'} />
        <ActivityIndicator size='large' color='green' />
      </View>
    )
  }

  // if (error) {
  //     return (
  //         <View style={styles.indicator}>
  //             <StatusBar style="dark" />
  //             <Text style={styles.errorText}>Network Error</Text>
  //             <TouchableOpacity onPress={getProduct} style={styles.errorButton}>
  //                 <Text style={styles.errorButtonText}>
  //                     Try Again
  //                 </Text>
  //             </TouchableOpacity>
  //         </View>
  //     );
  // };

  const toggleModal = () => {
    setLines(true);
    setModalVisible(!isModalVisible);
  };

  const openModal = (item) => {
    setModalVisible(true);
    setDogItems(item);
  }

  const deleteDog = async (id) => {
    try {
      toggleModal();
      setIsFetching(true);
      await firebase.firestore().collection('Dogs').doc(id).delete();
      getData().then(() => {
        setIsFetching(false);
      });
    } catch (err) {
      Alert.alert(err.message); 
    }
  };

  const logout = async () => {
    setIsFetching(true);
    try {
      await firebase.auth().signOut();
      navigation.replace('Sign In');
    } catch (err) {
      setIsFetching(false)
      Alert.alert(err.message);
    }
  }    

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Dashboard</Text>
      <Text style={styles.text}>Hæ {name} þetta er profile skjárinn</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Útskráning</Text>
      </TouchableOpacity>
      
    </View>
  )
}
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark"  backgroundColor={height > 850 ? '#D7D7D7' : '#FFFFFF'} />
      <FlatList
        keyExtractor={item => item.id}
        data={dogs}
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        ListHeaderComponent={() => <ProfileHeader navigation={navigation} logout={logout} username={getUser.username} userphoto={getUser.userphoto} />}
        renderItem={({ item }) => {
            return (
              <>
                <TouchableOpacity 
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
                </TouchableOpacity>
              </>
            );
        }} 
      />
      <PetModal 
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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 150,
    padding: 5,
    backgroundColor: '#ff9999',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 15,
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  flatList: {
    flex: 1,
    alignSelf: 'center',
    marginBottom: hp(2)
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  dogContainer: { 
    height: hp(22.5), 
    backgroundColor: 'white', 
    width: wp(42.5),
    margin: hp(1.2),
    elevation: 2.8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginBottom: hp(.8)
  },
  container: {
  dogTitle: { 
    marginBottom: hp(2), 
    textAlign: 'center', 
    marginTop: hp(2), 
    fontSize: hp(2), 
    fontWeight: 'bold' 
  },
  dogImage: { 
    flex: 1, 
    height: null, 
    width: null 
  },
  indicator: {
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
    backgroundColor: 'white'
  }
});