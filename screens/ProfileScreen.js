<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ProfileHeader from "../components/ProfileHeader";
import PetModal from "../components/PetModal";
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import PetComponent from "../components/PetComponent";
const { height } = Dimensions.get("window");
=======
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProfileHeader from '../components/ProfileHeader';
import PetModal from '../components/PetModal';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import PetComponent from '../components/PetComponent';
const { height } = Dimensions.get('window');
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
export default function ProfileScreen({ navigation }) {
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
<<<<<<< HEAD
        const userSnapshot = await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();
        const userdata = userSnapshot.data();
        setGetUser({
          username: userdata.name,
          userphoto: userdata.photo,
        });
        const dogSnapshot = await firebase
          .firestore()
          .collection("Dogs")
          .where("User", "==", user.uid)
          .get();
=======
        const userSnapshot = await firebase.firestore().collection('users').doc(user.uid).get();
          const userdata = userSnapshot.data();
          setGetUser({
            username: userdata.name,
            userphoto: userdata.photo
          });
        const dogSnapshot = await firebase.firestore().collection('Dogs').where("User", "==", user.uid).get();
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
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
<<<<<<< HEAD
          transformArray.sort((a, b) => b.id > a.id);
=======
          transformArray.sort((a,b) => b.id > a.id);
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
        });
        setDogs(transformArray);
      }
    } catch (err) {
      setError(true);
    }
  }, [setError]);
  useEffect(() => {
    setIsFetching(true);
    getData().then(() => {
        setIsFetching(false);
    });
  }, [getData, setIsFetching]);
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
<<<<<<< HEAD
  };
=======
  }
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
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
<<<<<<< HEAD
      navigation.push("Initial");
=======
      navigation.replace('Sign In');
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
    } catch (err) {
      setIsFetching(false)
      Alert.alert(err.message);
    }
<<<<<<< HEAD
  };
=======
  }    
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark"  backgroundColor={height > 850 ? '#D7D7D7' : '#FFFFFF'} />
      <FlatList
        keyExtractor={item => item.id}
        data={dogs}
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
<<<<<<< HEAD
        ListHeaderComponent={() => (
          <ProfileHeader
            navigation={navigation}
            logout={logout}
            username={getUser.username}
            userphoto={getUser.userphoto}
          />
        )}
=======
        ListHeaderComponent={() => <ProfileHeader navigation={navigation} logout={logout} username={getUser.username} userphoto={getUser.userphoto} />}
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
        renderItem={({ item }) => {
            return (
              <>
              <TouchableOpacity 
                onPress={() => { 
                  setModalVisible(true);
<<<<<<< HEAD
                  openModal(item);
                }}
              >
                <PetComponent
                  Name={item.Name}
                  Breed={item.Breed}
                  Photo={item.Photo}
                />
              </TouchableOpacity>
            </>
          );
        }}
=======
                  openModal(item)
                }}>
                  <PetComponent
                    Name={item.Name}
                    Breed={item.Breed}
                    Photo={item.Photo}
                  />
                </TouchableOpacity>
              </>
            );
        }} 
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
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
<<<<<<< HEAD
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
  },
  flatList: {
    flex: 1,
    flexDirection: "column",
=======
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  flatList: {
    flex: 1,
    flexDirection: 'column',
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
    paddingHorizontal: hp(2),
    marginBottom: hp(2),
  },

<<<<<<< HEAD
  dogTitle: {
    marginBottom: hp(2),
    textAlign: "center",
    marginTop: hp(2),
    fontSize: hp(2),
    fontWeight: "bold",
=======
  dogTitle: { 
    marginBottom: hp(2), 
    textAlign: 'center', 
    marginTop: hp(2), 
    fontSize: hp(2), 
    fontWeight: 'bold' 
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
  },
  dogImage: { 
    flex: 1, 
    height: null, 
    width: null 
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  }
});