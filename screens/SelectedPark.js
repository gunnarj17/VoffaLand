import React,{useState,useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Modal, TextInput, Keyboard, KeyboardAvoidingView, FlatList, ActivityIndicator, SafeAreaView} from "react-native";
import park_img from '../assets/place_holder.png';
import star_outline from '../assets/star_outline.png';
import star_filled from '../assets/star_filled.png';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import { Chip } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';


// import Weather from '../components/GetWeather'
import API_KEY from '../API/Weather'
import { ScrollView } from 'react-native-gesture-handler';
import { color } from 'react-native-elements/dist/helpers';

export default function SelectedPark( props ) {
    const [comments, setComments] = useState([]); // set/add comments

    const [loading, setLoading] = useState(true); 
    const [allComments, getComments] = useState([]); // get comments

    const [avgStars, getAvgStars] = useState(); // get avg stars
    const [sumComments, getsumComments] = useState();

    const [actionTriggered, setActionTriggered] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [defaultRating, setdefaultRating] = useState(2);
    const [maxRating, setmaxRating] = useState([1,2,3,4,5]);
    const [userComment, setuserComment] = useState(null);
    // const [parkId, setparkId] = useState([''])
    
    const [getUser, setGetUser] = useState({});
    const [error, setError] = useState();
    const [isFetching, setIsFetching] = useState(false);

    const [environments,setEnvironments]=useState([]);

    const fetchEnvironments=async()=>{
        const currentPark = props.route.params.ID;
        const response = firebase.firestore().collection('Parks').doc(currentPark);
        const data=await response.get();
        const userdata = data.data();
        setEnvironments(userdata);
        // console.log(environments.isMol);
    }
    useEffect(() => {
        fetchEnvironments();
      }, [])

    const RenderEnvironmet = () => {
        let showEnvo = [];
        var uniqueId = 0;
        if (environments.isBrottganga == true) {
            uniqueId += 1;
            showEnvo.push(
                <Chip style={styles.Chip} key={uniqueId} textStyle={{ color: "white"}}>Brött Ganga</Chip>
            )
        }
        if (environments.isGraslendi == true) {
            uniqueId += 1;
            showEnvo.push(
                <Chip style={styles.Chip} key={uniqueId} textStyle={{ color: "white"}}>Graslendi</Chip>
            )
        }
        if (environments.isMoi == true) {
            uniqueId += 1;
            showEnvo.push(
                <Chip style={styles.Chip} key={uniqueId} textStyle={{ color: "white"}}>Mói</Chip>
            )
        }
        if (environments.isMol == true) {
            uniqueId += 1;
            showEnvo.push(
                <Chip style={styles.Chip} key={uniqueId} textStyle={{ color: "white"}}>Möl</Chip>
            )
        }
        if (environments.isSjor == true) {
            uniqueId += 1;
            showEnvo.push(
                <Chip style={styles.Chip} key={uniqueId} textStyle={{ color: "white"}}>Sjór</Chip>
            )
        }
        if (environments.isSkogur == true) {
            uniqueId += 1;
            showEnvo.push(
                <Chip style={styles.Chip} key={uniqueId} textStyle={{ color: "white"}}>Skógur</Chip>
            )
        }
        if (environments.isTraut == true) {
            uniqueId += 1;
            showEnvo.push(
                <Chip style={styles.Chip} key={uniqueId} textStyle={{ color: "white"}}>Þraut</Chip>
            )
        }
        if (environments.isVatn == true) {
            uniqueId += 1;
            showEnvo.push(
                <Chip style={styles.Chip} key={uniqueId} textStyle={{ color: "white"}}>Vatn</Chip>
            )
        }

        return (
            <View style={styles.umhverfiChips}>
                {showEnvo}
            </View>
        )
    }

    // Veðrið
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
            var countRating = 0; 
            var avgRating = 0; 
            for (let i = 0; i <= all.length - 1; i++) {
                // console.log(all[i])
                if (all[i].ParkId == currentPark) {
                    countRating += 1;
                    avgRating += all[i].Rating;
                    correctPark.push(all[i])
                }
            }
            avgRating = avgRating/countRating;
            // console.log("Samtals ratings deilt með fjölda ratings: " + avgRating.toFixed());
            getAvgStars(avgRating.toFixed());
            getsumComments(countRating);
            getComments(correctPark);
            setLoading(false);
          });
          
        // Unsubscribe from events when no longer in use
        return () => commenters();
      }, []);
        if (loading) {
            return <ActivityIndicator />;
        }
        
        const RenderavgRating = () => {
            var avgRating = avgStars;
            var missingStars = 5 - avgStars;
            var uniqueId = 0;
            let stars = [];
            let noStars = [];

            for (let i = 1; i <= avgRating; i++) {
                uniqueId += 1;
                stars.push(
                    <AntDesign key={uniqueId} name="star" size={26} style={styles.starIcon}/>
                )
            }

            for (let i = 1; i <= missingStars; i++) {
                uniqueId += 1;
                noStars.push(
                    <AntDesign key={uniqueId} name="staro" size={26} style={styles.starIcon}/>
                )
            }

            return (
                <View style={styles.topStar}>{stars}{noStars}<Text style={styles.modalText}>({sumComments})</Text></View>
            );
        }

    return (
        <SafeAreaView style={{flex: 1}}>
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

                        {/* Comment text box-ið */}
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

            {/* Parturinn af skjánum sem inniheldur nafn, lýsingu og directions takka, veðurspá */}
            <View style={styles.middleContainer}>
                <View style={styles.starReview}>
                    <RenderavgRating/>
                </View>
                <View style={styles.middleContainerHeader}>
                    <View style={styles.titleDir}>
                        <Text style={styles.panelTitle}>{props.route.params && props.route.params.Name ? props.route.params.Name : "Vantar nafn"}</Text>
                        <TouchableOpacity 
                            style={styles.iconButton}
                            onPress={() => console.log("Vantar virkni")}
                        >
                            <FontAwesome5 name="directions" size={26} color="white" />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Hérna kemur veðurspáin*/}
                    <View style={styles.weather}>
                        <Image style={styles.weatherimage}
                        source={{uri:"http://openweathermap.org/img/wn/"+info.icon+"@2x.png"}}
                        />
                        <Text style={styles.weatherText}>Hiti: {info.temp}°</Text>
                    </View>
                    
                </View>
                <RenderEnvironmet/>
                <View style={styles.aboutParkContainer}>
                
                    <Text style={styles.aboutPark}>{props.route.params.Information}</Text>
                    {/* <RenderEnvironmet/> */}
                    {/* <RenderEnvironmet/> */}
                </View>

                {/* Parturinn af skjánum fyrir comment og stjörnugjafir. Hér vantar virkni til að birta ummæli */}
                <View style={styles.reviewComponent}>
                <View style={styles.reviewComponentHeader}>
                    <View style={styles.leftReviewComponent}>
                        <Text style={styles.commentTitle}>Ummæli</Text>
                        <View style={styles.borderLine}/>
                    </View>
                    <View style={styles.rightReviewComponent}>
                        {/* Takki sem er fimm gular stjörnur. Opnar review modal-inn */}
                        <TouchableOpacity 
                        style={styles.reviewButton}
                        onPress={() => { setModalVisible(true); setActionTriggered('ACTION_1');}}>
                            <Text style={styles.buttonText}>Skrifa ummæli</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.commentSection}>
                
                        <FlatList
                        contentContainerStyle={{ paddingBottom: 150 }}
                            data={allComments}
                            renderItem={({ item }) => (
                            <View style={styles.commentBox}>
                                <Text style={{fontSize: hp(2.6)}}>{item.UserName}</Text>
                                <Text>Rating: {item.Rating}</Text>
                                <Text style={{fontSize: hp(2)}}>{item.Comment}</Text>
                            </View>
                            )}
                        />
                    
                </View>
                </View>
            </View>
            
        </View>
        </SafeAreaView>
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
    },
    imgStyle: {
        flex: 1,
        alignSelf: 'stretch',
        width: undefined,
        height: undefined
    },
    topStar: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starReview: {
        // flexDirection: 'row',
        paddingLeft: wp(5),
        flexWrap: 'nowrap',
    },
    middleContainer: {
        flex: 2,
        paddingTop: hp(2),
    },
    middleContainerHeader:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingLeft: wp(5),
        paddingRight: wp(5),
        paddingBottom: hp(3),
    },
    panelTitle: {
        fontSize: hp(3.5),
        paddingRight: wp(5),
        paddingRight: wp(5)
    },
    titleDir: {
        flexDirection: 'row'
    },
    aboutParkContainer: {
        paddingLeft: wp(3),
        paddingRight: wp(2),
        paddingTop: hp(2),
        paddingBottom: hp(2)
    },
    aboutPark: {
        fontSize: hp(2.2),
    },

    reviewComponent: {
        paddingTop: hp(1),
    },
    reviewComponentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    leftReviewComponent: {
        alignSelf: 'flex-start',
        paddingLeft: wp(3),
    },
    commentTitle: {
        fontSize: hp(3),
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
        backgroundColor: "#034B42",
        padding: wp(3),
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: hp(2)
    },
    starIcon: {
        padding: 1,
        color: 'orange',
        flexWrap: 'nowrap'
    },
    weather:{
        width: wp(20),
        height: hp(8),
        borderRadius: 20,
        backgroundColor: '#B9E2F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    weatherimage:{
        width: 100,
        height: 100,
    },
    weatherText:{
        color: 'black',
    },
    commentSection: {
        paddingLeft: wp(5),
        paddingRight: wp(10),
        paddingBottom: hp(10)
    },
    commentBox: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        paddingTop: hp(1),
        paddingBottom: hp(1)
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
        fontSize: hp(2),
        textAlign: 'center',
      },
      modalTextHeader: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: hp(2.8)
      },
      modalTextName: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: hp(2.8),
        marginBottom: 15
      },
      modalText:{
        textAlign: 'center',
        fontSize: hp(2),
        marginBottom: 15
      },
      confirmmodalText: {
        textAlign: 'center',
        fontSize: hp(2),
        fontWeight: 'bold',
        marginBottom: hp(4)
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
        fontSize: hp(2),
        paddingLeft: wp(4),
        paddingRight: wp(4),
        height: hp(8),
        width: wp(65),
        marginBottom: hp(4)
      },
      umhverfiChips:{
          flexWrap: 'wrap',
      },
      Chip: {
          backgroundColor: '#79BE66',
          margin: 2
      }
    
})