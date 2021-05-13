import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import * as firebase from 'firebase';

export default function LoadingScreen({ navigation }) {
    useEffect(
        () => {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    navigation.replace('Parks');
                } else {
                    navigation.replace('Home');
                }
            });
        }
    );

    return (
        <View style={styles.container}>
            <ActivityIndicator size='large' />
        </View>
    );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
=======
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
