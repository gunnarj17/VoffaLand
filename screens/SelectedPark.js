import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Modal, TextInput, Keyboard, KeyboardAvoidingView} from "react-native";
import park_img from '../assets/place_holder.png';
import star_outline from '../assets/star_outline.png';
import star_filled from '../assets/star_filled.png';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 

export default function SelectedPark( props ) {
    const [actionTriggered, setActionTriggered] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [defaultRating, setdefaultRating] = useState(2);
    const [maxRating, setmaxRating] = useState([1,2,3,4,5]);

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
                            onPress={() => { setActionTriggered('ACTION_2'); console.log("Fjöldi stjarna: ",defaultRating)
                            }}>
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
        </View>
      );
}

const styles = StyleSheet.create({
    parentContainer: {
        flex: 1
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
      }
    
})