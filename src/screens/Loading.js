import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import logo from '../../assets/VLlogo.png';

// this gives us the capability of using all the firebase methods in our application
import * as firebase from 'firebase';
import { firebaseConfig } from './src/firebase/config';

// run the firebase initialize app with the firebase config then we can run the firebase functions that are
// available in the SDK. Will only run if it isn't already running.
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

export default class Loading extends React.Component {

    componentDidMount() {
        this.checkIfLoggedIn();
    }

    // creating method to see if user is logged in
    checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.navigation.navigate('Parks');
            }
            else {
                this.props.navigation.navigate('Login');
            }
        });
    };

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F9F4',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignContent: 'space-around',
    },
});