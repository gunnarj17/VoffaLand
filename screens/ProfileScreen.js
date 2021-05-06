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
    setIsFetching(true);
    getData().then(() => {
      setIsFetching(false);
    });
  }, [getData, setIsFetching]);

  if (isFetching) {
    return (
      <View style={styles.indicator}>
        <StatusBar
          style="dark"
          backgroundColor={height > 850 ? "#D7D7D7" : "#FFFFFF"}
        />
        <ActivityIndicator size="large" color="green" />
      </View>
    );
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
  };

  const deleteDog = async (id) => {
    try {
      toggleModal();
      setIsFetching(true);
      await firebase.firestore().collection("Dogs").doc(id).delete();
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
      navigation.replace("Sign In");
    } catch (err) {
      setIsFetching(false);
      Alert.alert(err.message);
    }
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
              <TouchableOpacity 
                onPress={() => { 
                  setModalVisible(true);
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
    paddingHorizontal: hp(2),
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
  dogTitle: {
    marginBottom: hp(2),
    textAlign: "center",
    marginTop: hp(2),
    fontSize: hp(2),
    fontWeight: "bold",
  },
  dogImage: {
    flex: 1,
    height: null,
    width: null,
  },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
