import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image
} from 'react-native';

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
  Icon
} from 'native-base';
import * as firebase from 'firebase';

import { signInWithEmail } from '../API/firebaseMethods';

import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { ResponseType } from 'expo-auth-session';

import apiKeys from '../config/keys';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

    signIn(email, password);
    signInWithEmail(email, password);
    setEmail('');
    setPassword('');
  };

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
           <View>
           <InputBox
              icon="mail-outline"
              label="Netfang"
              errorText=""
              isPassword={false}
              inputValue={(email) => setEmail(email)}
            />
          <View style={styles.EmailForm}>
            <Icon style={styles.Icons}
              name='mail-outline' />
            <Item floatingLabel>
              <Label style={styles.LabelText}>Netfang</Label>

            <InputBox
              icon="lock-closed-outline"
              label="Lykilorð"
              isPassword={true}
              errorText={passwordError}
              inputValue={(password) => setPassword(password)}
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
            <Icon style={styles.Icons}
              name='lock-closed-outline'
            />
           
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
                source={require("../assets/facebook.png")}
                style={styles.SocialBtnImg}
              />
            </Button>
            <Button
              style={styles.SocialBtn}
              onPress={() => ggPromptAsync()}
            >
              <Image
                source={require("../assets/google.png")}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#F2F9F4',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'space-around',
  },

  HeaderText: {
    color: '#56B980',
    fontSize: 40,
    fontWeight: "bold",
  },
  text: {
    color: '#fff',
    fontSize: 20,
    // fontFamily: Lato-Regular
  },
  LoginContainer: {
    flex: 2,
    width: 300,
    height: 200,
    margin: 40,
    marginTop: 100,
    backgroundColor: '#F2F9F4',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  LabelText: {
    color: '#56B980',
    fontSize: 20
  },

  LoginButtons: {
    marginTop: 30,
    marginBottom: 30,
  },

  LoginButton: {
    margin: 15,
    backgroundColor: '#56B980',
    borderRadius: 20,
    height: 55
  },
  BottomContainer: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'space-around',
    justifyContent: 'flex-end',
    marginBottom: 36
  },
  ContinueText: {
    color: '#56B980',
    fontSize: 20,
  },
  ContinueTextBold: {
    color: '#56B980',
    fontSize: 20,
    fontWeight: 'bold'
  },
  ContinueButton: {
    backgroundColor: '#F2F9F4',
    marginBottom: 10
  },
  EmailForm: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  Icons: {
    color: '#56B980',
    paddingTop: 40,
  },
  InputBox: {
    color: '#56B980',
    alignSelf: 'center',
    margin: 2,
  },
  ExtraOptions: {
    padding: 10
  },
  ForgotPassword: {
    alignSelf: 'flex-end',
    color: '#56B980',
    fontSize: 15,
    fontWeight: 'bold'
  },
  SocialButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  SocialBtn: {
    marginLeft: 15,
    marginRight: 15,
    width: 50,
    height: 50,
    backgroundColor: 'white'
  },
  SocialBtnImg: {
    width: 50,
    height: 50
  }
});