import React, { useState } from "react";
import {View, Text, StyleSheet,} from "react-native";
import {Container, Form, Button, } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { registration } from "../API/firebaseMethods";
import InputBox from "./components/InputBox";
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView, Keyboard, StyleSheet } from 'react-native';
import { Container, Content, Header, From, Input, Item, Label, Form, Button, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { registration } from '../API/firebaseMethods';

export default function SignUp({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const emptyState = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handlePress = () => {
    if (!name) {
     Alert.alert("Nafn ekki rétt sláð inn");
      Alert.alert('Nafn ekki rétt sláð inn');
    } else if (name.length < 3) {
     Alert.alert("Nafn of stutt");
      Alert.alert('Nafn of stutt');
    } else if (!email) {
      Alert.alert("Vantar netfang");
      Alert.alert('Vantar netfang');
    } else if (!password) {
      setPasswordError("Vantar lykilorð")
     Alert.alert("Vantar lykilorð");
      Alert.alert('Vantar lykilorð');
    } else if (!confirmPassword) {
      setPassword("");
     Alert.alert("Vantar staðfestingar lykilorð");
      setPassword('');
      Alert.alert('Vantar staðfestingar lykilorð');
    } else if (password !== confirmPassword) {
     Alert.alert("Lykilorð passa ekki");
      Alert.alert('Lykilorð passa ekki');
    } else {
      registration(email, password, name);
      navigation.navigate("Loading");
      registration(
        email,
        password,
        name,
      );
      navigation.navigate('Loading');
      emptyState();
    }
  };
  
// Vil gera einhver cool error messages hérna, frekar en þetta Alert
  const inputNameChange = (value) => {
    setName(value)
    if(value.length < 3) {
      // setSome Error
      } 
      else {
        // clear the error aka setja sem ''
      }
  }

  return (

    <View style={styles.container}>

      <Container style={styles.LoginContainer}>
        <Text style={styles.HeaderText}>Nýr notandi</Text>

        
        <Form>
          <View style={styles.FormContainer}>
            <InputBox
              icon="person-outline"
              label="Nafn"
              errorText=""
              isPassword={false}
              inputValue={(name) => inputNameChange(name)}
            />
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

            <InputBox
              icon="lock-closed-outline"
              label="Staðfesta lykilorð"
              errorText=""
              isPassword={true}
              inputValue={(password2) => setConfirmPassword(password2)}
            />

            <View style={styles.EmailForm}>
              <Icon style={styles.Icons}
                name='person-outline'
              />
              <Item floatingLabel>
                <Label style={styles.LabelText}>Nafn</Label>
                <Input
                  style={styles.InputBox}
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={name}
                  onChangeText={(name) => setName(name)} // setur þennan input sem name
                />
              </Item>
            </View>

            <View style={styles.EmailForm}>
              <Icon style={styles.Icons}
                name='mail-outline'
              />
              <Item floatingLabel>
                <Label style={styles.LabelText}>Netfang</Label>
                <Input
                  style={styles.InputBox}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
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
                  value={password}
                  secureTextEntry={true}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(password) => setPassword(password)} // setur þennan input sem password
                />
              </Item>
            </View>

            <View style={styles.EmailForm}>
              <Icon style={styles.Icons}
                name='lock-closed-outline'

              />
              <Item floatingLabel>
                <Label style={styles.LabelText}>Staðfesta lykilorð</Label>
                <Input
                  style={styles.InputBox}
                  secureTextEntry={true}
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={(password2) => setConfirmPassword(password2)} // setur þennan input sem confirm password
                />
              </Item>
            </View>

            <View style={styles.LoginButtons}>
              <Button style={styles.RegisterButton} full onPress={handlePress}>
              <Button style={styles.RegisterButton}
                full
                onPress={handlePress}>
                <Text style={styles.text}>Nýskráning</Text>
              </Button>
            </View>
            
          </View>
        </Form>
      </Container>

      <View style={styles.BottomContainer}>
        <Text style={styles.ContinueText}>Ertu nú þegar með með aðgang? </Text>
        <Button
          style={styles.ContinueButton}
          full
          success
          onPress={() => navigation.navigate("Sign In")}
        >
          onPress={() => navigation.navigate('Sign In')}>
          <Text style={styles.ContinueTextBold}>Innskráning</Text>
        </Button>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#F2F9F4",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "space-around",
    backgroundColor: '#F2F9F4',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'space-around',
  },
  HeaderText: {
    color: "#56B980",
    color: '#56B980',
    fontSize: 40,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: "#fff",
    color: '#fff',
    fontSize: 20,
    // fontFamily: Lato-Regular
  },
  LoginContainer: {
    flex: 2,
    width: 300,
    height: 200,
    backgroundColor: "#F2F9F4",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    backgroundColor: '#F2F9F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  FormContainer: { 
  },
  LabelText: {
    color: '#56B980',
    fontSize: 20
  },
  FormContainer: {},

  LoginButtons: {
    marginTop: 30,
    marginBottom: 30,
  },
  RegisterButton: {
    margin: 15,
    backgroundColor: "#56B980",
    backgroundColor: '#56B980',
    borderRadius: 20,
  },
  BottomContainer: {
    flex: 1,
    alignItems: "center",
    alignContent: "space-around",
    justifyContent: "flex-end",
    marginBottom: 36,
    alignItems: 'center',
    alignContent: 'space-around',
    justifyContent: 'flex-end',
    marginBottom: 36
  },
  ContinueText: {
    color: "#56B980",
    color: '#56B980',
    fontSize: 20,
    paddingBottom: 10,
  },
  ContinueTextBold: {
    color: "#56B980",
    color: '#56B980',
    fontSize: 20,
    fontWeight: "bold",
    fontWeight: 'bold'
  },
  ContinueButton: {
    backgroundColor: "#F2F9F4",
    marginBottom: 10,
    backgroundColor: '#F2F9F4',
    marginBottom: 10
  },

  EmailForm: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Icons: {
    color: '#56B980',
    paddingTop: 40,
  },
  InputBox: {
    borderBottomColor: '#56B980',
    alignSelf: 'center',
    color: '#56B980',
  }
});