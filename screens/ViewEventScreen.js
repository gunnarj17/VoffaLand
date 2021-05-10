import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Platform, ScrollView, Alert, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

const { height } = Dimensions.get('window');

export default function ViewEventScreen({ navigation, route }) {
  const {
    id,
    photo,
    event,
    park,
    date,
    description
  } = route.params;

  const [getUsers, setGetUsers] = useState([]);
  const [userItems, setUserItems] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [loggedUser, setLogggedUser] = useState(null);

  const [lines, setLines] = useState(true);

  const [dogs, setDogs] = useState([]);

  const [isJoining, setIsJoining] = useState(false);
  const [isDogs, setIsDogs] = useState(false);


  const getData = useCallback(async () => {
    try {

      const user = await firebase.auth().currentUser;

      if (user) {
        setLogggedUser(user);
      }

      const snapshot = await firebase.firestore().collection('UserEvents').doc(id).get();

      const { 
        users
      } = snapshot.data();

      setGetUsers(users);

    } catch (err) {
      Alert.alert(err.message);
    }
  }, [setGetUsers]);

  useEffect(() => {
    setIsFetching(true);
    getData().then(() => {
      setIsFetching(false);
    });
  }, [getData, setIsFetching]);

  if (isFetching) {
    return (
      <View style={styles.indicator}>
        <StatusBar style="dark"  backgroundColor={height > 850 ? '#80A5A0' : '#80A5A0'} />
        <ActivityIndicator size='large' color='green' />
      </View>
    )
  };

  const onsubmit = async () => {
    setIsJoining(true);
    try {

      let transformArray = [];

      const user = await firebase.auth().currentUser;

      if (user) {

        const userSnapshot = await firebase.firestore().collection('users').doc(user.uid).get();

        const userdata = userSnapshot.data();

        const dogSnapshot = await firebase.firestore().collection('Dogs').where("User", "==", user.uid).limit(2).get();

        dogSnapshot.forEach((res) => {

          const { Name, Photo, Breed, Birthday, About } = res.data();

          transformArray.push({
            id: res.id,
            Name,
            Photo,
            Breed,
            Birthday,
            About
          });

          transformArray.sort((a,b) => b.id > a.id);

        });

        const object = {
          id: userSnapshot.id,
          username: userdata.name,
          userphoto: userdata.photo,
          dogs: transformArray
        };

        await firebase.firestore().collection('UserEvents').doc(id).update({
          users: firebase.firestore.FieldValue.arrayUnion(object)
        });

        const res = await firebase.firestore().collection('UserEvents').doc(id).get();

        const { 
          users
        } = res.data();

        setGetUsers(users);

        setIsJoining(false);

        Alert.alert('join successfully');

      }
    } catch (err) {
      setIsJoining(false);
      Alert.alert(err.message);
    }
  };

  const onChangeSubmit = async () => {
    setIsJoining(true);
    try {

      const user = await firebase.auth().currentUser;

      if (user) {

        const resArray = await firebase.firestore().collection('UserEvents').doc(id).get();

        const filter = resArray.data().users.filter(e => e.id !== user.uid);

        console.log(filter)

        await firebase.firestore().collection('UserEvents').doc(id).update({
          users: filter
        });

        const res = await firebase.firestore().collection('UserEvents').doc(id).get();

        const { 
          users
        } = res.data();

        setGetUsers(users);

        setIsJoining(false);

        Alert.alert('not joining successfully');

      }
    } catch (err) {
      setIsJoining(false);
      console.log(err)
      Alert.alert(err.message);
    }
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setDogs([]);
    setUserItems({})
  };

  function ageCalculator(dateString) {   
    if (dateString == undefined) {
        return;
    }

    var dob = new Date(dateString);

    var dobYear = dob.getYear();  
    var dobMonth = dob.getMonth();  
    var dobDate = dob.getDate();  
        
    var now = new Date();  

    var currentYear = now.getYear();  
    var currentMonth = now.getMonth(); 
    var currentDate = now.getDate();  
      
    var age = {};  
    var ageString = "";  
    
    var yearAge = currentYear - dobYear;  
      
    if (currentMonth >= dobMonth)  
      var monthAge = currentMonth - dobMonth;  
    else {  
      yearAge--;  
      var monthAge = 12 + currentMonth - dobMonth;  
    }  
  
    if (currentDate >= dobDate)  
      var dateAge = currentDate - dobDate;  
    else {  
      monthAge--;  
      var dateAge = 31 + currentDate - dobDate;  
  
      if (monthAge < 0) {  
        monthAge = 11;  
        yearAge--;  
      }  
    } 

    age = {  
        years: yearAge,  
        months: monthAge,  
        days: dateAge  
    };  
        
    if ( (age.years > 1) && (age.months > 0) && (age.days > 0) )  
       ageString = age.years + " ára, " + age.months + " mánaða, og " + age.days + " daga";  
       else if ( (age.years > 0 && age.years <= 1) && (age.months > 0) && (age.days > 0) )  
       ageString = age.years + " árs, " + age.months + " mánaða, og " + age.days + " daga";  
    else if ( (age.years == 0) && (age.months == 0) && (age.days > 0) )  
       ageString = "Bara " + age.days + " daga";  
    else if ( (age.years > 0) && (age.months == 0) && (age.days == 0) )  
       ageString = age.years +  " ár";  
    else if ( (age.years > 0) && (age.months > 0) && (age.days == 0) )  
       ageString = age.years + " ára og " + age.months + " mánaða";  
    else if ( (age.years == 0) && (age.months > 0) && (age.days > 0) )  
       ageString = age.months + " mánaða " + age.days + " daga";  
    else if ( (age.years > 0) && (age.months == 0) && (age.days > 0) )  
       ageString = age.years + " ára, og" + age.days + " daga";  
    else if ( (age.years == 0) && (age.months > 0) && (age.days == 0) )  
       ageString = age.months + " mánaða";  
    else ageString = "Þetta er fyrsti dagurinn";   

    return ageString;

  }  


  const getDogsData = async (userid) => {

    console.log(userid)
    setIsDogs(true);

    try {

      let transformArray = [];

      const dogSnapshot = await firebase.firestore().collection('Dogs').where("User", "==", userid).get();

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

      console.log(transformArray)

      setDogs(transformArray);

      setIsDogs(false);

    } catch (err) {
      setIsDogs(false);
      Alert.alert(err.message);
    }
  };

  const openModal = (item) => {
    setUserItems(item);
    setModalVisible(true);
    getDogsData(item.id);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark"  backgroundColor={height > 850 ? '#80A5A0' : '#80A5A0'} />
      <FlatList
        keyExtractor={item => item.id}
        data={getUsers}
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() =>  {
          return (
            <View style={styles.container}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconContainer}>
                  <Ionicons name="arrow-back" size={hp(3.4)} color="black" />
                </TouchableOpacity>
              </View>
              <View style={styles.imageContainer}>
                <Image source={{ uri: photo }} style={styles.image} />
              </View>
              <View style={styles.textContainer}>
                  <Text numberOfLines={1} style={styles.text1}>
                    {event}
                  </Text>
                  <Text style={styles.text2}>
                    {date.toDate().getDate()}.{date.toDate().getMonth() + 1}.{date.toDate().getFullYear().toString().substr(-2)} kl.{date.toDate().toLocaleTimeString().substring(0, 5)}
                  </Text>
              </View>
              <Text style={styles.text3}>
                {park}
              </Text>
              <View style={styles.bottomLine} />
              <View style={styles.aboutContainer}>
                <Text style={styles.aboutText1}>
                  Um viðburðin
                </Text>
                <Text style={styles.aboutText2}>
                  {description}
                </Text>
              </View>
              <TouchableOpacity onPress={getUsers != undefined && getUsers.find(e => e.id === loggedUser.uid)  ? onChangeSubmit : onsubmit} activeOpacity={0.4} style={styles.buttonContainer}>
                <Text style={styles.buttonText}>
                 {getUsers != undefined && getUsers.find(e => e.id === loggedUser.uid)  ? 'ég er ekki að koma' : 'Ég mæti!' } 
                </Text>
              </TouchableOpacity>
              <Text style={styles.text4}>
                {getUsers != undefined ? getUsers.length : 0} hundavinir ætla að mæta
              </Text>
            </View>
          )
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => openModal(item)} activeOpacity={0.7} style={styles.userCardContainer}>
              <Avatar
                  rounded
                  source={{
                    uri: item.userphoto
                  }}
                  size='large'
                  containerStyle={styles.userimage}
              />
              <View style={styles.userCardSubContainer}>
                <Text style={styles.userText}>
                  {item.username}
                </Text>
                { item.dogs.map(item => {
                  return (
                    <Text key={item.id} style={styles.userText}>
                      {item.Name}
                    </Text>
                  )
                }) }
              </View>
            </TouchableOpacity>
          )
        }}
      />
      <Modal isVisible={isJoining}>
        { Platform.OS === 'android' ?
            <StatusBar backgroundColor='rgba(0,0,0,0.5)' />
          : null
        }
        <View style={styles.indicator}>
          <ActivityIndicator size='large' color='white' />
        </View>
      </Modal> 
      <Modal 
        isVisible={isModalVisible} 
        hasBackdrop={false}
      >
        {  Platform.OS === 'android' ?
            <StatusBar backgroundColor='rgba(0,0,0,0.5)' />
          : 
            null
        }
        <View style={styles.modalContainer}>
            { isDogs ?
                 <View style={styles.modalContainer}>
                <ActivityIndicator size='large' color='white' style={{ marginTop: hp(2), alignSelf: 'center' }} />
                </View>
              :
                <FlatList
                  keyExtractor={item => item.id}
                  data={dogs}
                  style={styles.modalContainer}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={() =>  {
                    return (
                      <>
                        <TouchableOpacity onPress={toggleModal} style={styles.closeIcon}>
                            <AntDesign name="closecircleo" size={24} color="black" />
                        </TouchableOpacity>
                        <Avatar
                            rounded
                            source={{
                                uri: userItems.userphoto
                            }}
                            size='xlarge'
                            containerStyle={styles.modalImage}
                        />
                        <Text style={styles.modalUserName}>
                            {userItems.username}
                        </Text>
                      </>
                    )
                  }}
                  renderItem={({ item }) => {
                    return (
                      <View activeOpacity={0.7} style={styles.dogModalCardContainer}>
                        <Avatar
                            rounded
                            source={{
                              uri:  item.Photo
                            }}
                            size='large'
                            containerStyle={styles.dogImage}
                        />
                        <View style={styles.dogModalCardSubContainer}>
                          <Text style={{...styles.dogText, fontWeight: 'bold'}}>
                            {item.Name}
                          </Text>
                          <Text style={styles.dogText}>
                            {item.Breed}
                          </Text>
                          <Text style={styles.dogText}>
                            {ageCalculator(item.Birthday)}
                          </Text>
                          <TouchableOpacity onPress={() => setLines(!lines)}>
                            <Text numberOfLines={lines ? 2 : null} style={styles.dogText}>
                              {item.About}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  }}
              />
            }
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
  header: { 
    height: hp(8), 
    backgroundColor: '#80A5A0', 
    marginTop: hp(4.4) 
  },
  headerIconContainer: { 
    marginTop: hp(1.4), 
    marginLeft: wp(8) 
  },
  closeIcon: { 
    alignSelf: 'flex-end', 
    marginRight: wp(4), 
    marginTop: hp(2) 
  },
  imageContainer: { 
    width: wp(100), 
    height: hp(25) 
  },
  image: { 
    flex: 1, 
    width: null, 
    height: null 
  },
  textContainer: { 
    flexDirection: 'row', 
    marginTop: hp(2.5) 
  },
  text1: { 
    fontSize: hp(2.5), 
    width: wp(52), 
    fontWeight: 'bold', 
    paddingLeft: wp(5) 
  },
  text2: { 
    fontSize: hp(2.1), 
    paddingTop: hp(.4) 
  },
  text3: { 
    fontSize: hp(2.5), 
    marginTop: hp(.5), 
    paddingLeft: wp(5) 
  },
  bottomLine: { 
    borderWidth: .6, 
    marginTop: hp(3)  
  },
  aboutContainer: { 
    marginTop: hp(3), 
    marginLeft: wp(5) 
  },
  aboutText1: { 
    fontSize: hp(2.5), 
    fontWeight: 'bold' 
  },
  aboutText2: { 
    fontSize: hp(2.3), 
    width: wp(90), 
    marginTop: hp(1.5) 
  },
  buttonContainer: { 
    backgroundColor: '#81A5A0', 
    alignSelf: 'center', 
    marginTop: hp(4), 
    borderRadius: 20  
  },
  buttonText: { 
    fontSize: hp(2.6), 
    color: '#fff', 
    paddingHorizontal: 15, 
    padding: 10 
  },
  text4: { 
    fontSize: hp(2.4), 
    textAlign: 'center', 
    marginTop: hp(2.4), 
    marginBottom: hp(3) 
  },
  userCardContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#80A5A0', 
    width: wp(96), 
    alignSelf: 'center', 
    marginBottom: hp(3), 
    borderRadius: 10 
  },
  userCardSubContainer: { 
    marginLeft: hp(3), 
    marginTop: hp(2), 
    marginBottom: hp(2) 
  },
  userText: { 
    fontSize: hp(2.4), 
    color: 'white' 
  },
  userimage: {
    marginLeft: hp(3),
    marginTop: hp(2),
    marginBottom: hp(2)
  },
  modalContainer: {
    height: hp(65),
    alignSelf: 'center',
    backgroundColor: 'white',
    borderWidth: .5,
    borderRadius: 30
  },
  modalImage: {
    marginTop: hp(1.8),
    alignSelf: 'center',
    width: wp(28),
    height: wp(28),
    borderWidth: .8
  },
  modalUserName: { 
    marginTop: hp(3), 
    marginBottom: hp(4), 
    textAlign: 'center', 
    fontWeight: 'bold', 
    color: 'black', 
    fontSize: hp(2.8)
  },
  dogModalCardContainer: {
    flexDirection: 'row', 
    width: wp(80), 
    alignSelf: 'center', 
    borderRadius: 10 
  },
  dogModalCardSubContainer: {
    marginLeft: hp(3), 
    marginTop: hp(3), 
    marginBottom: hp(2) 
  },
  dogImage: {
    marginLeft: hp(3),
    marginTop: hp(2),
    marginBottom: hp(2),
    borderWidth: .8
  },
  dogText: {
    fontSize: hp(2.4), 
    color: 'black'
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});