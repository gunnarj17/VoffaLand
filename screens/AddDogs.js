import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform, Dimensions, ActivityIndicator, ScrollView, SafeAreaView, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Input, Avatar } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons, Ionicons, Octicons, MaterialIcons } from '@expo/vector-icons';
import { ActionSheetCustom as ActionSheet } from '@alessiocancian/react-native-actionsheet';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import * as firebase from 'firebase';
import 'firebase/firestore';
import "firebase/auth";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { height } = Dimensions.get('window');

const AddDogs = ({ navigation, route }) => {
    let actionSheet = useRef();

    const { dogId, dogName, dogBreed, dogDescription, dogSex, dogBirthday, dogPhoto } = route.params;
    
    const [name, setName] = useState(dogName === undefined ? '' : dogName);
    const [breed, setBreed] = useState(dogBreed === undefined ? '' : dogBreed);
    const [description, setDescription] = useState(dogDescription === undefined ? '' : dogDescription);
    const [checked, setChecked] = useState(dogSex === undefined ? 'Rakki' : dogSex);
    const [date, setDate] = useState(dogBirthday === undefined ? new Date(1598051730000) : new Date(dogBirthday));
    const [photoURL, setPhotoURL] = useState(dogPhoto === undefined ? null : dogPhoto);

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [isFetching, setIsFetching] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };
    
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const optionArray = [
        <View style={styles.flexDirectionRow}>
            <Ionicons name="ios-camera" size={hp(3)} color="gray" />
            <Text style={{ ...styles.actionSheetOptions, marginLeft: wp(1.5) }}>Myndavél</Text>
        </View>
        , 
        <View style={styles.flexDirectionRow}>
            <MaterialIcons name="perm-media" size={hp(3)} color="gray" />
            <Text style={{ ...styles.actionSheetOptions, marginLeft: wp(1.8) }}>Albúm</Text>
        </View>, 
        'Cancel'
    ];

    const showActionSheet = () => {
        actionSheet.current.show();
    };

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

    const submit = async () => {
        if (name == '' || breed == '' || description == '' || photoURL == null) {
            Alert.alert('fields are empty. Fill the fields.');
        } else {
            setIsFetching(true);
            try {
                const user = await firebase.auth().currentUser;

                if (user) {

                    var metadata = {
                        contentType: 'image/jpeg',
                    };
        
                    const blob = await new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.onload = function() {
                            resolve(xhr.response);
                        };
                        xhr.onerror = function(e) {
                            reject(new TypeError('Network request failed'));
                        };
                        xhr.responseType = 'blob';
                        xhr.open('GET', photoURL, true);
                        xhr.send(null);
                    });

                    const filename = photoURL.substring(photoURL.lastIndexOf('/') + 1);
                    const res = firebase.storage().ref(filename);
                    await res.put(blob, metadata);
                    
                    blob.close();
        
                    const imgUrl = await firebase.storage().ref(filename).getDownloadURL();

                    await firebase.firestore().collection('Dogs').add({
                        Name: name,
                        About: description,
                        Breed: breed,
                        Sex: checked,
                        Birthday: date.toUTCString(),
                        Photo: imgUrl,
                        User: user.uid
                    });

                    Alert.alert('Voffanum þínum hefur verið bætt við prófílinn þinn!');

                    setName('');
                    setDescription('');
                    setPhotoURL(null);
                    setBreed('');
                    setIsFetching(false);
                }

                navigation.goBack();

            } catch (err) {
                setIsFetching(false);
                Alert.alert(err.message);
            }
        }
    };

    const update = async () => {
        if (name == '' || breed == '' || description == '' || photoURL == null) {
            Alert.alert('fields are empty. Fill the fields.');
        } else {
            setIsFetching(true);
            try {

                const user = await firebase.auth().currentUser;

                if (user) {

                    if (photoURL.split('/')[0] == 'https:') {

                        await firebase.firestore().collection('Dogs').doc(dogId).update({
                            Name: name,
                            About: description,
                            Breed: breed,
                            Sex: checked,
                            Birthday: date.toUTCString(),
                            Photo: photoURL,
                            User: user.uid
                        });

                    } else {

                        var metadata = {
                            contentType: 'image/jpeg',
                        };
            
                        const blob = await new Promise((resolve, reject) => {
                            const xhr = new XMLHttpRequest();
                            xhr.onload = function() {
                                resolve(xhr.response);
                            };
                            xhr.onerror = function(e) {
                                reject(new TypeError('Network request failed'));
                            };
                            xhr.responseType = 'blob';
                            xhr.open('GET', photoURL, true);
                            xhr.send(null);
                        });

                        const filename = photoURL.substring(photoURL.lastIndexOf('/') + 1);
                        const res = firebase.storage().ref(filename);
                        await res.put(blob, metadata);
                        
                        blob.close();
            
                        const imgUrl = await firebase.storage().ref(filename).getDownloadURL();

                        await firebase.firestore().collection('Dogs').doc(dogId).update({
                            Name: name,
                            About: description,
                            Breed: breed,
                            Sex: checked,
                            Birthday: date.toUTCString(),
                            Photo: imgUrl,
                            User: user.uid
                        });

                    }
                }

                Alert.alert('Dogs updated successfully');

                setName('');
                setDescription('');
                setPhotoURL(null);
                setBreed('');
                setIsFetching(false);

                navigation.goBack();
            } catch (err) {
                setIsFetching(false);
                Alert.alert(err.message);
            }
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark"  backgroundColor={height > 850 ? '#D7D7D7' : '#FFFFFF'} />
            <KeyboardAwareScrollView>
                <View style={styles.container}> 

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                    <MaterialCommunityIcons name='keyboard-backspace' size={hp(4)} color='#445975' />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    { dogId != undefined ? 'Uppfæra Voffa' : 'Nýr Voffi!' }
                </Text>
                <Avatar
                    rounded
                    source={{
                        uri: photoURL ? photoURL : 'http://www.gravatar.com/avatar/4e0a22e6cc6e4fe4c4b5e8f4bee57a6a?s=200&r=pg&d=mm'
                    }}
                    onPress={showActionSheet}
                    size='xlarge'
                    containerStyle={styles.img}
                />
                <Input
                    placeholder='Hvað heitir hundurinn?'
                    autoCorrect={false}
                    inputStyle={styles.inputStyle}
                    inputContainerStyle={{ ...styles.inputContainerStyle, marginTop: hp(6) }}
                    value={name}
                    onChangeText={(e) => setName(e)}
                />
                <Input
                    placeholder='Hvaða tegund er hann?'
                    autoCorrect={false}
                    inputStyle={styles.inputStyle}
                    inputContainerStyle={{ ...styles.inputContainerStyle, marginTop: hp(1) }}
                    value={breed}
                    onChangeText={(e) => setBreed(e)}
                />
                <TextInput
                    placeholder='Hvernig myndir þú lýsa hundinum þínum?'
                    autoCorrect={false}
                    multiline={true}
                    maxLength={120}
                    style={styles.descriptionInput}
                    value={description}
                    onBlur={Keyboard.dismiss}
                    onChangeText={(e) => setDescription(e)}
                />
                <View style={{ ...styles.inputContainerStyle, marginBottom: hp(4), marginTop: hp(3) }}>
                    <Text style={styles.mixText}>
                        Fæðingardagur
                    </Text>
                    <TouchableOpacity 
                        onPress={showDatepicker} 
                        style={styles.dateContainer}
                    >
                        <Text style={styles.dateText}>
                            {date.toDateString()}
                        </Text>
                        <Octicons name="calendar" size={hp(3.4)} color="black" style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                </View>
                <View style={{ ...styles.inputContainerStyle, flexDirection: 'row', marginBottom: hp(4), marginTop: hp(1) }}>
                    <Text style={styles.sexText}>
                        Kyn
                    </Text>
                    { Platform.OS === 'android' ?
                        <RadioButton
                            value="Rakki"
                            status={ checked === 'Rakki' ? 'checked' : 'unchecked' }
                            onPress={() => setChecked('Rakki')}
                        />
                    :
                        <View style={styles.radioIos}>
                            <RadioButton
                                value="Rakki"
                                status={ checked === 'Rakki' ? 'checked' : 'unchecked' }
                                onPress={() => setChecked('Rakki')}
                            />
                        :
                        </View>
                    }
                    <Text style={styles.mixText}>
                        Rakki
                    </Text>
                    { Platform.OS === 'android' ?
                        <RadioButton
                            value="Tík"
                            status={ checked === 'Tík' ? 'checked' : 'unchecked' }
                            onPress={() => setChecked('Tík')}
                        />
                    :
                        <View style={styles.radioIos}>
                            <RadioButton
                                value="Tík"
                                status={ checked === 'Tík' ? 'checked' : 'unchecked' }
                                onPress={() => setChecked('Tík')}
                            />
                        </View>
                    }
                    <Text style={styles.mixText}>
                        Tík
                    </Text>
                </View>
            
                <TouchableOpacity onPress={dogId === undefined ? submit : update} activeOpacity={0.6} style={styles.submitButtonContainer}>
                    <Text style={styles.submitButton}>
                        Staðfesta
                    </Text>
                </TouchableOpacity>

            </View>
        </KeyboardAwareScrollView>
            <ActionSheet
                ref={actionSheet}
                title={<Text style={styles.actionSheetTitle}>Bæta við mynd</Text>}
                options={optionArray}
                cancelButtonIndex={2}
                destructiveButtonIndex={2}
                onPress={(index) => {
                if (index == 0) {
                    pickImageCamera()
                } else if (index == 1) {
                    pickImageGallery()
                } else {}
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
                {   Platform.OS === 'android' ?
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
    backIcon: {
        marginTop: hp(2),
        marginLeft: wp(7),
    },
    headerTitle: {
        marginTop: hp(2),
        fontSize: hp(3.4),
        textAlign: 'center',
        fontWeight: '400',
        color: '#034B42'
    },
    img: {
        marginTop: hp(4),
        alignSelf: 'center',
        width: wp(40),
        height: wp(40),
        borderWidth: .8
    },
    flexDirectionRow: { 
        flexDirection: 'row'
    },
    actionSheetTitle: { 
        fontSize: hp(2.6), 
        fontWeight: '500', 
        color: '#0B666B',
    },
    actionSheetOptions: { 
        fontSize: hp(2.4), 
        color: 'gray'
    },
    inputStyle: { 
        fontSize: hp(2.3), 
        color: '#353D40', 
    },
    inputContainerStyle: { 
        width: wp(75), 
        marginTop: hp(1), 
        alignSelf: 'center' 
    },
    descriptionInput: { 
        width: wp(75), 
        alignSelf: 'center', 
        textAlignVertical: 'top', 
        paddingLeft: 10, 
        paddingTop: 8, 
        marginTop: hp(1), 
        height: hp(15), 
        backgroundColor: 'white', 
        borderRadius: 10, 
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        fontSize: hp(2.3),
        color: '#353D40'
    },
    dateContainer: { 
        flexDirection: 'row', 
        borderRadius: 8,
        elevation: 5,
        backgroundColor: 'white',
        width: wp(55), 
        padding: 8, 
        paddingHorizontal: 15,
        marginTop: hp(3),
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2
    },
    dateText: { 
        fontSize: height < 600 ? hp(2.4) : hp(2.2), 
        width: wp(40), 
        alignSelf: 'center',
        color: 'gray'
    },
    DateTimePickerView: { 
        backgroundColor: 'white', 
        borderWidth: 1, 
        borderColor: 'green' 
    },
    sexText: { 
        fontSize: hp(2.4), 
        color: 'gray', 
        marginTop: hp(1), 
        marginRight: wp(15) 
    },
    mixText: { 
        fontSize: hp(2.4), 
        color: 'gray', 
        marginTop: hp(1) 
    },
    submitButtonContainer: { 
        alignSelf: 'center', 
        marginBottom: hp(6), 
        marginTop: hp(2), 
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        borderRadius: 20, 
        backgroundColor: 'white' 
    },
    radioIos: { 
        borderWidth: 1.3, 
        width: 38, 
        height: 38, 
        marginTop: hp(.5), 
        padding: 0, 
        marginHorizontal: wp(2), 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    submitButton: { 
        fontSize: hp(2.8), 
        padding: 12, 
        paddingHorizontal: 20, 
        color: '#63AAB5' 
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
});

export default AddDogs
