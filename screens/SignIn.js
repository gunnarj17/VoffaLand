import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Keyboard,  TouchableWithoutFeedback } from 'react-native';
import { Container, Content, Header, From, Input, Item, Label, Form, Button, Icon } from 'native-base';
import { signIn } from '../API/firebaseMethods';
import InputBox from './components/InputBox';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState("");

  const handlePress = () => {
    if (!email) {
      Alert.alert('Vantar að slá inn rétt netfang');
    }

    if (!password) {
      Alert.alert('Vantar að slá inn rétt lykilorð');
    }

    signIn(email, password);
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
  ExtraOptions: {
    padding: 10
  },
  ForgotPassword: {
    alignSelf: 'flex-end',
    color: '#56B980',
    fontSize: 15,
    fontWeight: 'bold'
  }
});