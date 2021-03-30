import * as firebase from 'firebase';
import 'firebase/firestore';
import { Alert } from 'react-native';

export async function registration(email, password, name) {
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        const currentUser = firebase.auth().currentUser;

        const db = firebase.firestore();
        console.log(currentUser);
        db.collection('users')
            .doc(currentUser.uid)
            .set({
                email: currentUser.email,
                name: name,
            });
    } catch (err) {
        Alert.alert('There is something wrong!', err.message);
    }
}

export async function signIn(email, password) {
    try {
        await firebase
            .auth()
            .signInWithEmailAndPassword(email, password);
    } catch (err) {
        Alert.alert('There is something wrong!', err.message);
    }
}

export async function loggingOut() {
    try {
        await firebase.auth().signOut();
    } catch (err) {
        Alert.alert('There is something wrong!', err.message);
    }
}