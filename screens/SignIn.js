import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Keyboard,  TouchableWithoutFeedback, SafeAreaView, Image } from 'react-native';
import { Container, Form, Button, } from 'native-base';
import { signIn } from '../API/firebaseMethods';
import InputBox from './components/InputBox';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AntDesign } from '@expo/vector-icons'; 
import * as firebase from 'firebase';
import { signInWithEmail } from '../API/firebaseMethods';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { ResponseType } from 'expo-auth-session';
import apiKeys from '../config/keys';
export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState("");
  const [request, response, ggPromptAsync] = Google.useIdTokenAuthRequest(
    {
      clientId: apiKeys.extra.clientId
    },
  );

  // Method to handle register if user is not registered yet.
  registerAccount = async (currentUser) => {
    const db = firebase.firestore();
    const savedUser = await db.collection('users')
      .doc(currentUser.uid)
      .get()
    if (!savedUser.data()) {
      db.collection('users')
        .doc(currentUser.uid)
        .set({
          email: currentUser.email,
          name: currentUser.name || currentUser.displayName,
        });
    }
  }

  // Hook for Google SignIn 
  React.useEffect(() => {
    async function signInWithGoogle() {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
        await firebase.auth().signInWithCredential(credential);
        const currentUser = firebase.auth().currentUser;
        await registerAccount(currentUser);
      } else if (response?.error) {
        Alert.alert('Google Login Error:', response.error);
      }
    }
    signInWithGoogle();
  }, [response]);
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    responseType: ResponseType.Token,
    clientId: apiKeys.extra.facebookAppId,
  });
  React.useEffect(() => {
    async function signInWithFacebook() {
      if (fbResponse?.type === 'success') {
        const { access_token } = fbResponse.params;
        const credential = firebase.auth.FacebookAuthProvider.credential(access_token);
        // Sign in with the credential from the Facebook user.
        await firebase.auth().signInWithCredential(credential);
        const currentUser = firebase.auth().currentUser;
        await registerAccount(currentUser);
      } else if (response?.error) {
        Alert.alert('Facebook Login Error:', response.error);
      }
    }
    signInWithFacebook();
  }, [fbResponse]);
  const handlePress = () => {
    if (!email) {
      Alert.alert('Vantar að slá inn rétt netfang');
    }
    if (!password) {
      Alert.alert('Vantar að slá inn rétt lykilorð');
    }
    signInWithEmail(email, password);
    setEmail('');
    setPassword('');
  };
  return (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> 
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Container style={styles.LoginContainer}>
          <Text style={styles.HeaderText}>Innskráning</Text>
          <Form>
            <View>
            <InputBox
                icon="mail-outline"
                label="Netfang"
                errorText=""
                isPassword={false}
                inputValue={(email) => setEmail(email)}
              />
              <InputBox
                icon="lock-closed-outline"
                label="Lykilorð"
                isPassword={true}
                errorText={passwordError}
                inputValue={(password) => setPassword(password)}
              />
            
            <View style={styles.ExtraOptions}>
              <Text style={styles.ForgotPassword}>Gleymt lykilorð?</Text>
            </View>
            <View style={styles.LoginButtons}>
              <Button style={styles.LoginButton}
                full
                onPress={handlePress}>
                {/* // þegar ýtt er á Innskráning (login) þá fer hann í loginUser fallið og ath með email og password  */}
                <Text style={styles.text}>Skrá inn</Text>
              </Button>
            </View>
            <View style={styles.SocialButtons}>
            <Button
              style={styles.SocialBtn}
              onPress={() => fbPromptAsync()}
            >
               <Image
                source={require("../assets/f-logo.png")}
                style={styles.SocialBtnImg}
              />
            </Button>
            <Button
              style={styles.SocialBtn}
              onPress={() => ggPromptAsync()}
            >
              <Image
                source={require("../assets/g-logo.png")}
                style={styles.SocialBtnImg}
              />
            </Button>
          </View>
            <View style={styles.BottomContainer}>
              <Text style={styles.ContinueText}>Ekki með aðgang? </Text>
              <Button
                style={styles.ContinueButton}
                full
                success
                onPress={() => navigation.navigate("Sign Up")}>
                <Text style={styles.ContinueTextBold}> Nýskrá</Text>
              </Button>
            </View>
            </View>
          </Form>
        </Container>
      </View>
    </SafeAreaView>
  </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: 'white',
    flex: 1
  },
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'space-around',
  },
  HeaderText: {
    color: '#069380',
    fontSize: hp(5),
    fontWeight: "300",
  },
  text: {
    color: '#fff',
    fontSize: hp(2.5),
    // fontFamily: Lato-Regular
  },
  LoginContainer: {
    flex: 2,
    width: wp(75),
    height: hp(80),
    paddingTop: hp(10),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  LoginButtons: {
    marginTop: hp(5)
  },
  LoginButton: {
    marginHorizontal: wp(10),
    backgroundColor: '#069380',
    borderRadius: 20,
  },
  BottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: hp(5)
  },
  ContinueText: {
    color: '#069380',
    fontSize: hp(2.5),
    paddingBottom: hp(1)
  },
  ContinueTextBold: {
    color: '#069380',
    fontSize: hp(2.5),
    fontWeight: 'bold'
  },
  ContinueButton: {
    backgroundColor: 'white',
  },
  ExtraOptions: {
    padding: hp(1)
  },
  ForgotPassword: {
    alignSelf: 'flex-end',
    color: '#069380',
    fontSize: hp(2),
    fontWeight: 'bold'
  },
  SocialButtons: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  SocialBtn: {
    backgroundColor: 'white',
    height: hp(10),
    width: wp(20),
    alignSelf: 'center',
    paddingLeft: wp(3)
  },
  SocialBtnImg: {
    alignSelf: 'center',
    height: hp(7),
    width: wp(15),
  }
});