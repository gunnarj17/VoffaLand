import React,{useState,useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Modal, TextInput, Keyboard, KeyboardAvoidingView, FlatList, ActivityIndicator} from "react-native";
import park_img from '../assets/place_holder.png';
import star_outline from '../assets/star_outline.png';
import star_filled from '../assets/star_filled.png';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 

import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';


// import Weather from '../components/GetWeather'
import API_KEY from '../API/Weather'

export default function SelectedPark( props ) {
    const [comments, setComments] = useState([]); // set/add comments

    const [loading, setLoading] = useState(true); 
    const [allComments, getComments] = useState([]); // get comments

    const [actionTriggered, setActionTriggered] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [defaultRating, setdefaultRating] = useState(2);
    const [maxRating, setmaxRating] = useState([1,2,3,4,5]);
    const [userComment, setuserComment] = useState(null);
    // const [parkId, setparkId] = useState([''])
    
    const [getUser, setGetUser] = useState({});
    const [error, setError] = useState();
    const [isFetching, setIsFetching] = useState(false);

    // Veðrið
    // console.log(props.route.params)
    const [Latitude, setLatitude] = useState(props.route.params.Lat);
    const [Longitude, setLongitude] = useState(props.route.params.Long);
    let url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + Longitude + '&lon=' + Latitude + '&units=metric&appid=59989a6fa648999ce02375ef2c360678';

    // console.log(Latitude);
    // console.log(Longitude);

    const [info,setInfo] = useState ({
        name:"Villa!",
        temp:"Villa!",
        icon:"Villa!",
    })
    useEffect(()=>{
        getWeather()
    },[])
    const getWeather = (Latitude, Longitude) => {
        // console.log(url)
        fetch(url)
        .then(data=>data.json())
        .then(results=>{
            // console.log(results)
            setInfo({
                temp:results.main.temp,
                icon:results.weather[0].icon
            })
            // console.log(info.icon)
        })
    }
    // ----- Endir á Veður kóðanum

    // Ná í nafn á user og UserId
    const getName = useCallback(async () => {
        setError(null);
        try {
    
          const user = await firebase.auth().currentUser;
        //   console.log(user.uid);
    
          if (user) {
            const userSnapshot = await firebase
              .firestore()
              .collection("users")
              .doc(user.uid)
              .get();
    
            const userdata = userSnapshot.data();
            // console.log(userdata.name);
            setGetUser({
              username: userdata.name,
              userId: user.uid,
            });
          }
        } catch (err) {
          setError(true);
        }
      }, [setError]);
      
      useEffect(() => {
        setIsFetching(true);
        getName().then(() => {
          setIsFetching(false);
        });
      }, [getName, setIsFetching]);

    //   console.log(getUser.username);
    //   console.log(getUser);
    // console.log(props.route.params.ID);


    // Vista comments, stjörnugjöf og annað tengt userinum í firestore

    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let autoId = ''

    const submitComment = async () => {
    for (let i = 0; i < 20; i++) {
        autoId += CHARS.charAt(
        Math.floor(Math.random() * CHARS.length)
        )
    }

        firebase.
        firestore()
        .collection('comments')
        .add({
            key: autoId,
            UserId: getUser.userId,
            UserName: getUser.username,
            Comment: userComment,
            Rating: defaultRating,
            ParkId: props.route.params.ID,
            date: firebase.firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
            console.log("Það virkaði að setja inn comment");
        })
        .catch((error) => {
            console.log("Eitthvað fór úrskeiðis við að gefa endurgjöf", error);
        });
      }

    // Þetta er stjörnugjafar gæjinn
    const CustomRatingBar = () => {
        return (
            <View style={styles.customRatingBarStyle}>
                {
                    maxRating.map((item, key) => {
                        return (
                            <TouchableOpacity
                            activeOpacity={0.7}
                            key={item}
                            onPress={() => setdefaultRating(item)}>
                                <Image style={styles.starImg} 
                                    source={
                                    item <= defaultRating
                                        ? star_filled
                                        : star_outline
                                }  />
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }

    

    // ná í comments
    useEffect(() => {
        const currentPark = props.route.params.ID;
        const commenters = firebase.firestore()
          .collection('comments')
          .onSnapshot(querySnapshot => {
            const all = [];
      
            querySnapshot.forEach(documentSnapshot => {
                all.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            });

            const correctPark = [];
            for (let i = 0; i <= all.length - 1; i++) {
                // console.log(all[i])
                if (all[i].ParkId == currentPark) {
                    // console.log("Park number: " + [i])
                    // console.log("Park inside array: " + all[i].ParkId)
                    // console.log(all[i])
                    correctPark.push(all[i])
                }
            }
            console.log(correctPark);
            // console.log(currentPark)
            getComments(correctPark);
            setLoading(false);
          });
          console.log()
        // Unsubscribe from events when no longer in use
        return () => commenters();
      }, []);
        if (loading) {
            return <ActivityIndicator />;
        }
        
    return (
        <View style={styles.parentContainer}>
            {/* Hér er einkunnar módalinn */}
            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {Alert.alert('Modal has been closed. ');}} //OnRequest close is called when the user taps the hardware back button on Android. Required for Android users
            > 
            {/* ACTION_1 er aðal módalinn, þegar smellt er á 'Staðfesta' opnast nýr módall sem segir "umsögn þín hefur verið skráð" */}
            {actionTriggered === 'ACTION_1' ?
                <KeyboardAvoidingView 
                    style ={styles.centeredView}  
                    behavior="padding">
                        {/* Til að loka modal-num án þess að senda gögn áfram (x takkinn í efra horni) */}
                        <View style={styles.modalView}>
                            <View style={styles.closeModalView}> 
                                <TouchableOpacity  onPress={() => {setModalVisible(!modalVisible)}}>
                                    <AntDesign name="closecircleo" size={26} style={styles.closeIcon} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalViewHeader}>
                                <Text style={styles.modalTextHeader}>Endurgjöf fyrir</Text>
                                <Text style={styles.modalTextName}>{props.route.params.Name}</Text>
                            </View>

                            {/* Hérna kalla ég á stjörnugjafa gæjan sem ég gerði efst í skjalinu */}
                            <View style={styles.modalViewStars}>
                                <Text style={styles.modalText}>Hversu margar stjörnur gefur þú svæðinu?</Text>
                                <CustomRatingBar/>
                            </View>

                        {/* Comment text box-ið. Kann ekki að sækja upplýsingar úr því, kannski hægt að endurtaka það sem er á SignIn og SignUp? */}
                            <View>
                                <Text style={styles.modalText}>Hvaða ummælum viltu koma á framfæri?</Text>
                                <TextInput
                                style={styles.inputBox}
                                placeholder="Hámark 120 stafir"
                                maxLength={120}
                                onChangeText = {(content) => setuserComment(content)} //update-ar comment state með því sem er skrifað í comment textaboxið
                                multiline={true} //þetta þarf að vera true svo að línurnar wrap-ist
                                numberOfLines={4} //held að þetta geri ekkert, en virkar kannski betur i android
                                onBlur={Keyboard.dismiss}/>
                            </View>

                        {/* Hér þarf að senda gögnin í Firebase. 
                        - setActionTrigger opnar hinn modalinn sem sést fyrir neðan
                        - á eftir að sækja gögnin út text input-inu og senda þau hér líka
                        - defaultRating skilar stjörnu magni sem notandi sláði inn */}
                            <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => { submitComment(); setActionTriggered('ACTION_2');}}>
                                <Text style={styles.textStyle}>Staðfesta</Text>
                            </TouchableOpacity>
                        </View>
                </KeyboardAvoidingView> :
                
                actionTriggered === 'ACTION_2' ?
                
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.confirmmodalText}>Endurgjöfin þín hefur verið skráð</Text>
                            <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => {setModalVisible(!modalVisible)}}>
                                <Text style={styles.textStyle}>Loka</Text>
                            </TouchableOpacity>
                        </View> 
                    </View>:
                null}
            </Modal>
            

            {/* Hér er það sem er á skjánum, sem er ekki einkunnargjöf modal-inn */}

            <View style={styles.imgContainer}>
                <Image source={park_img}  style={styles.imgStyle}/>
            </View>

            {/* Parturinn af skjánum sem inniheldur nafn, lýsingu og directions takka, vantar veðurspá */}
            <View style={styles.middleContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.panelTitle}>{props.route.params && props.route.params.Name ? props.route.params.Name : "Vantar nafn"}</Text>
                    
                    {/* Hérna kemur veðurspáin*/}
                    <View style={styles.weather}>
                        <Image style={styles.weatherimage}
                        
                        source={{uri:"http://openweathermap.org/img/wn/"+info.icon+"@2x.png"}}
                        />
                        <Text style={styles.weatherText}>Hiti: {info.temp}°</Text>
                    </View>
                    

                    {/* <Weather></Weather> */}

                    {/* Hérna þarf að birta actual stjörnugjöf sem svæðið hefur, þetta eru bara place-holder icons */}
                        <AntDesign name="staro" size={24} color="black" />
                    <Text style={styles.aboutPark}>{props.route.params.Information}</Text>
                    {/* Hérna þarf líka að birta tögg-in sem svæðið hefur :) */}
                </View>
                <View style={styles.rightContainer}>
                    {/* Hérna er Directions takkinn. Vantar virkni í hann */}
                    <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => console.log("Vantar virkni")}
                    >
                        <FontAwesome5 name="directions" size={26} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Parturinn af skjánum fyrir comment og stjörnugjafir. Hér vantar virkni til að birta ummæli */}
            <View style={styles.reviewComponent}>
                <View style={styles.leftReviewComponent}>
                    <Text style={styles.commentTitle}>Ummæli</Text>
                    <View style={styles.borderLine}/>
                </View>
                <View style={styles.rightReviewComponent}>
                    {/* Takki sem er fimm gular stjörnur. Opnar review modal-inn */}
                    <TouchableOpacity 
                    style={styles.reviewButton}
                    onPress={() => { setModalVisible(true); setActionTriggered('ACTION_1');}}>
                        <AntDesign name="staro" size={26} style={styles.starIcon}/>
                        <AntDesign name="staro" size={26} style={styles.starIcon} />
                        <AntDesign name="staro" size={26} style={styles.starIcon} />
                        <AntDesign name="staro" size={26} style={styles.starIcon} />
                        <AntDesign name="staro" size={26} style={styles.starIcon} />
                    </TouchableOpacity>
                </View>
                
            </View>
                <FlatList
                    data={allComments}
                    renderItem={({ item }) => (
                    <View>
                        <Text>User Name: {item.UserName}</Text>
                        <Text>Rating: {item.Rating}</Text>
                        <Text>Comment: {item.Comment}</Text>
                        <Text>Staður: {item.ParkId}</Text>
                    </View>
                    )}
                />
                
        </View>
      );
}

const styles = StyleSheet.create({
    parentContainer: {
        flex: 1,
        backgroundColor: "#F7F5F4"
    },
    iconStyle:{
        color: 'white',
        borderRadius: 100,
    },
    iconButton: {
        alignItems:'center',
        justifyContent:'center',
        width:40,
        height:40,
        backgroundColor: "#034B42",
        borderRadius:50,
        },
    imgContainer: {
        flex: 1,
        paddingTop: 70
    },
    imgStyle: {
        flex: 1,
        alignSelf: 'stretch',
        width: undefined,
        height: undefined
    },
    middleContainer: {
        flex: 1,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingTop: 20,
    },
    textContainer:{
        alignSelf: 'flex-start',
        paddingLeft: 20,
    },
    panelTitle: {
        fontSize: 30,
        paddingBottom: 10
    },
    aboutPark: {
        fontSize: 16,
    },
    rightContainer: {
        flex: 1,
        direction: 'rtl',
        paddingLeft: 20
    },
    reviewComponent: {
        flex: 1,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    leftReviewComponent: {
        alignSelf: 'flex-start',
        paddingLeft: 20,
    },
    commentTitle: {
        fontSize: 25
    },
    borderLine:{
        borderBottomColor: '#C4C4C4',
        borderBottomWidth: 1,
        paddingTop: 5,
        width: 150,
        paddingRight: 20
    },
    rightReviewComponent: {
        direction: 'rtl',
        paddingLeft: 20,
    },
    reviewButton:{
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row',
    },
    reviewButtonText:{
        fontSize: 16,
        color: 'white'
    },
    starIcon: {
        padding: 1,
        color: 'orange'
    },
    closeModalView: {
        alignSelf: 'flex-end'
    },
    closeIcon: {
        color: 'grey',
        paddingBottom: 15
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },

      closeModalButton: {
        backgroundColor: '#034B42',
        borderRadius: 20,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 60,
        paddingLeft: 60,
        elevation: 2,
      },
      textStyle: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
      },
      modalTextHeader: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
      },
      modalTextName: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 15
      },
      modalText:{
        textAlign: 'center',
        fontSize: 15,
        marginBottom: 15
      },
      confirmmodalText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 15
      },
      customRatingBarStyle: {
          justifyContent: 'center',
          flexDirection: 'row',
         
      },
      starImg: {
          width: 30,
          height: 30,
          resizeMode: 'cover',
          marginBottom: 15
      },
      inputBox:{
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 15,
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        width: 240,
        marginBottom: 30
      },
      weather:{
        width:80,
        height: 70,
        borderRadius: 30,
        backgroundColor: '#44cbe3',
        alignItems: 'center',
        justifyContent: 'center',
      },
      weatherimage:{
        width:100,
        height:100,
      },
      weatherText:{
          color: 'black',
      }
    
})