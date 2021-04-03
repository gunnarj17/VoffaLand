import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Container, Content, Header, From, Input, Item, Label, Form, Button, Icon } from 'native-base';
import { signIn } from '../API/firebaseMethods';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    
    <View style={styles.container}>
      <Text style={styles.HeaderText}>Innskráning</Text>
      <StatusBar style="auto" />

      <Container style={styles.LoginContainer}>
        <Form>
          <View style={styles.EmailForm}>
            <Icon style={styles.Icons}
              name='mail-outline' />
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
    justifyContent: 'center',
    alignItems: 'center',

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
    // margin: 40,
    backgroundColor: '#F2F9F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  }
});