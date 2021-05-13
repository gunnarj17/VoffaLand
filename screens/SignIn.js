<<<<<<< HEAD
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

import {
  Container,
  Content,
  Header,
  From,
  Input,
  Item,
  Label,
  Form,
  Button,
  Icon,
} from "native-base";
import * as firebase from "firebase";

import { signInWithEmail } from "../API/firebaseMethods";

import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { ResponseType } from "expo-auth-session";

import apiKeys from "../config/keys";

export default function SignIn({ navigation }) {
  console.log("SignIN Screen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [request, response, ggPromptAsync] = Google.useIdTokenAuthRequest({
    clientId: apiKeys.extra.clientId,
  });
=======
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
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388

  // Method to handle register if user is not registered yet.
  registerAccount = async (currentUser) => {
    const db = firebase.firestore();
    const savedUser = await db.collection("users").doc(currentUser.uid).get();
    if (!savedUser.data()) {
      db.collection("users")
        .doc(currentUser.uid)
        .set({
          email: currentUser.email,
          name: currentUser.name || currentUser.displayName,
        });
    }
  };

  // Hook for Google SignIn
  React.useEffect(() => {
    async function signInWithGoogle() {
      if (response?.type === "success") {
        const { id_token } = response.params;
        const credential = firebase.auth.GoogleAuthProvider.credential(
          id_token
        );
        await firebase.auth().signInWithCredential(credential);
        const currentUser = firebase.auth().currentUser;
        await registerAccount(currentUser);
      } else if (response?.error) {
        Alert.alert("Google Login Error:", response.error);
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
      if (fbResponse?.type === "success") {
        const { access_token } = fbResponse.params;
        const credential = firebase.auth.FacebookAuthProvider.credential(
          access_token
        );
        // Sign in with the credential from the Facebook user.
        await firebase.auth().signInWithCredential(credential);
        const currentUser = firebase.auth().currentUser;
        await registerAccount(currentUser);
      } else if (response?.error) {
        Alert.alert("Facebook Login Error:", response.error);
      }
    }
    signInWithFacebook();
  }, [fbResponse]);
  const handlePress = () => {
    if (!email) {
      Alert.alert("Vantar að slá inn rétt netfang");
    }
    if (!password) {
      Alert.alert("Vantar að slá inn rétt lykilorð");
    }
    signInWithEmail(email, password);
    setEmail("");
    setPassword("");
  };
<<<<<<< HEAD

  // const DismissKeyboard = ({ children }) => (
  //   <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
  //   {children}
  //   </TouchableWithoutFeedback>
  //   );

  return (
    <View style={styles.container}>
      <Container style={styles.LoginContainer}>
        <Text style={styles.HeaderText}>Innskráning</Text>

        <Form>
          <View style={styles.EmailForm}>
            <Icon style={styles.Icons} name="mail-outline" />
            <Item floatingLabel>
              <Label style={styles.LabelText}>Netfang</Label>

              <Input
                style={styles.InputBox}
                autoCorrect={false}
                autoCapitalize="none"
                value={email}
                onChangeText={(email) => setEmail(email)} // setur þennan input sem email
              />
            </Item>
          </View>

          <View style={styles.EmailForm}>
            <Icon style={styles.Icons} name="lock-closed-outline" />
            <Item floatingLabel>
              <Label style={styles.LabelText}>Lykilorð</Label>
              <Input
                style={styles.InputBox}
                secureTextEntry={true}
                autoCorrect={false}
                value={password}
                autoCapitalize="none"
                onChangeText={(password) => setPassword(password)} // setur þennan input sem password
              />
            </Item>
          </View>

          <View style={styles.ExtraOptions}>
            <Text style={styles.ForgotPassword}>Gleymt lykilorð?</Text>
          </View>

          <View style={styles.LoginButtons}>
            <Button style={styles.LoginButton} full onPress={handlePress}>
              {/* // þegar ýtt er á Innskráning (login) þá fer hann í loginUser fallið og ath með email og password  */}
              <Text style={styles.text}>Skrá inn</Text>
            </Button>
          </View>

          <View style={styles.SocialButtons}>
            <Button style={styles.SocialBtn} onPress={() => fbPromptAsync()}>
              <Image
                source={require("../assets/facebook.png")}
=======
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
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
                style={styles.SocialBtnImg}
              />
            </Button>
            <Button style={styles.SocialBtn} onPress={() => ggPromptAsync()}>
              <Image
                source={require("../assets/g-logo.png")}
                style={styles.SocialBtnImg}
              />
            </Button>
          </View>
<<<<<<< HEAD

          <View style={styles.BottomContainer}>
            <Text style={styles.ContinueText}>Ekki með aðgang? </Text>
            <Button
              style={styles.ContinueButton}
              full
              success
              onPress={() => navigation.navigate("Sign Up")}
            >
              <Text style={styles.ContinueTextBold}> Nýskrá</Text>
            </Button>
          </View>
        </Form>
      </Container>
    </View>
=======
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
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
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
<<<<<<< HEAD
    backgroundColor: "#F2F9F4",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "space-around",
=======
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'space-around',
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
  },
  HeaderText: {
<<<<<<< HEAD
    color: "#56B980",
    fontSize: 40,
    fontWeight: "bold",
  },
  text: {
    color: "#fff",
    fontSize: 20,
=======
    color: '#069380',
    fontSize: hp(5),
    fontWeight: "300",
  },
  text: {
    color: '#fff',
    fontSize: hp(2.5),
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
    // fontFamily: Lato-Regular
  },
  LoginContainer: {
    flex: 2,
<<<<<<< HEAD
    width: 300,
    height: 200,
    margin: 40,
    marginTop: 100,
    backgroundColor: "#F2F9F4",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  LabelText: {
    color: "#56B980",
    fontSize: 20,
  },

=======
    width: wp(75),
    height: hp(80),
    paddingTop: hp(10),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
  LoginButtons: {
    marginTop: hp(5)
  },
  LoginButton: {
<<<<<<< HEAD
    margin: 15,
    backgroundColor: "#56B980",
    borderRadius: 20,
    height: 55,
  },
  BottomContainer: {
    flex: 1,
    alignItems: "center",
    alignContent: "space-around",
    justifyContent: "flex-end",
    marginBottom: 36,
  },
  ContinueText: {
    color: "#56B980",
    fontSize: 20,
  },
  ContinueTextBold: {
    color: "#56B980",
    fontSize: 20,
    fontWeight: "bold",
  },
  ContinueButton: {
    backgroundColor: "#F2F9F4",
    marginBottom: 10,
  },
  EmailForm: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  Icons: {
    color: "#56B980",
    paddingTop: 40,
  },
  InputBox: {
    color: "#56B980",
    alignSelf: "center",
    margin: 2,
  },
  ExtraOptions: {
    padding: 10,
  },
  ForgotPassword: {
    alignSelf: "flex-end",
    color: "#56B980",
    fontSize: 15,
    fontWeight: "bold",
  },
  SocialButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  SocialBtn: {
    marginLeft: 15,
    marginRight: 15,
    width: 50,
    height: 50,
    backgroundColor: "white",
  },
  SocialBtnImg: {
    width: 50,
    height: 50,
  },
});
=======
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
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
