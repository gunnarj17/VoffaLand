import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Input, Avatar } from 'react-native-elements';
import { MaterialCommunityIcons, Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { ActionSheetCustom as ActionSheet } from '@alessiocancian/react-native-actionsheet';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as ImagePicker from 'expo-image-picker';
import { ProgressBar } from 'react-native-paper';

import * as firebase from 'firebase';
import 'firebase/firestore';

const ProfileHeader = ({ username, userphoto, navigation, logout }) => {
    let actionSheet = useRef();

    const [name, setName] = useState(username ? username : '');
    const [photoURL, setPhotoURL] = useState(userphoto ? userphoto : '');

    const [uploading, setUploading] = useState(false);

    const [transferred, setTranferred] = useState(0);

    const [nameDisabled, setNameDisabled] = useState(true);

    const optionArray = [
        <View style={styles.flexDirectionRow}>
            <Ionicons name="ios-camera" size={hp(3)} color="gray" />
            <Text style={{ ...styles.actionSheetOptions, marginLeft: wp(1.5) }}>Myndvél</Text>
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
                await uploadUserImage(result.uri);
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
                await uploadUserImage(result.uri);
            }
        } catch (err) {
            Alert.alert(err.message);
        }
    };

    const uploadUserImage = async (imageUrl) => {
        try {

            setUploading(true)
            setTranferred(0);

            var metadata = {
                contentType: 'image/jpeg',
            };

            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', imageUrl, true);
                xhr.send(null);
            });

            const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            const res = firebase.storage().ref(filename);
            const uploadTask = await res.put(blob, metadata);

            var progress = (uploadTask.bytesTransferred / uploadTask.totalBytes) * 100;

            setTranferred(progress);

            blob.close();

            const imgUrl = await firebase.storage().ref(filename).getDownloadURL();

            const user = await firebase.auth().currentUser;

            if (user) {
                const ref = await firebase.firestore().collection('users').doc(user.uid);
                await ref.update({
                    photo: imgUrl
                });
            }

            Alert.alert('Profile Photo Uploaded Succesfully');
        } catch (err) {
            Alert.alert(err.message);
        }

        setUploading(false)
        setTranferred(0);
    }

    const updateUserName = async () => {
        if (name == '') {
            Alert.alert('Field is empty');
        } else {

            try {

                const user = await firebase.auth().currentUser;

                if (user) {
                    const ref = await firebase.firestore().collection('users').doc(user.uid);
                    await ref.update({
                        name
                    });
                }

                Alert.alert('Username updated successfully');
            } catch (err) {
                Alert.alert(err.message)
            }

            setNameDisabled(true);
        }
    };

    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                    <MaterialCommunityIcons name='keyboard-backspace' size={hp(4)} color='#445975' />
                </TouchableOpacity>
                <TouchableOpacity onPress={logout} style={styles.logout}>
                    <AntDesign name='logout' size={hp(3)} color='red' />
                </TouchableOpacity>
            </View>

            <Avatar
                rounded
                source={{
                    uri: photoURL ? photoURL : 'http://www.gravatar.com/avatar/4e0a22e6cc6e4fe4c4b5e8f4bee57a6a?s=200&r=pg&d=mm'
                }}
                onPress={showActionSheet}
                size='xlarge'
                containerStyle={styles.img}
            />

            { uploading &&
                <ProgressBar progress={transferred} color='#6E6F77' style={styles.progress} />
            }

            <Input
                autoCorrect={false}
                rightIcon={{ type: 'font-awesome-5', color: '#162732', name: 'pen', onPress: () => setNameDisabled(!nameDisabled) }}
                disabled={nameDisabled}
                inputStyle={styles.inputStyle}
                inputContainerStyle={styles.inputContainerStyle}
                value={name}
                onChangeText={(text) => setName(text)}
            />

            { !nameDisabled &&
                <TouchableOpacity onPress={updateUserName} style={styles.saveButtonContainer}>
                    <Text style={styles.viewText}>
                        Vista
                    </Text>
                </TouchableOpacity>
            }

            <TouchableOpacity
                onPress={() => navigation.navigate('addDogs', {
                    dogId: undefined,
                    dogName: undefined,
                    dogBreed: undefined,
                    dogDescription: undefined,
                    dogSex: undefined,
                    dogBirthday: undefined,
                    dogPhoto: undefined
                })} style={{ ...styles.headingView, marginTop: hp(4), borderRadius: 20, backgroundColor: '#034B42' }}>
                <Text style={{ ...styles.viewText, color: 'white' }}>
                    Bæta við hundi
                </Text>
            </TouchableOpacity>

            <View style={styles.headingView2}>
                <Text style={{ ...styles.viewText, color: '#295E73', fontSize: hp(3), fontWeight: '300' }}>
                    Hundarnir Mínir
                </Text>
            </View>

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
                    } else { }
                }}
                styles={{
                    titleBox: { height: 70 },
                    buttonBox: { height: 55 }
                }}

            />
        </>

    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    backIcon: {
        marginTop: Platform.OS === 'android' ? hp(5) : hp(2)
    },
    logout: {
        marginTop: Platform.OS === 'android' ? hp(5.5) : hp(2.5)
    },
    img: {
        marginTop: hp(1.8),
        alignSelf: 'center',
        width: wp(40),
        height: wp(40),
        borderWidth: .8,
    },
    flexDirectionRow: {
        flexDirection: 'row'
    },
    progress: {
        width: wp(90),
        alignSelf: 'center',
        marginTop: hp(3)
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
        fontSize: hp(2.8),
        color: '#353D40',
    },
    inputContainerStyle: {
        marginTop: hp(4),
        width: wp(70),
        height: hp(5.8),
        alignSelf: 'center',
        paddingLeft: 3
    },
    saveButtonContainer: {
        borderWidth: 1.1,
        width: wp(30),
        marginBottom: hp(2),
        borderRadius: 15,
        alignSelf: 'center'
    },
    viewText: {
        textAlign: 'center',
        fontSize: hp(2.4),
        padding: 8
    },
    headingView: {
        borderRadius: 30,
        alignSelf: 'center',
        width: wp(60),
        padding: hp(0.5),
    },
    headingView2: {
        marginTop: hp(5),
        alignSelf: 'flex-start',
    }
});

export default ProfileHeader;