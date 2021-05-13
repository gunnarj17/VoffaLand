import React, { useState } from "react";
<<<<<<< HEAD
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  Keyboard,
  StyleSheet,
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
import { TouchableOpacity } from "react-native-gesture-handler";
import { registration } from "../API/firebaseMethods";

export default function SignUp({ navigation }) {
  console.log("SignUp Screen");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

=======
import {View, Text, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from "react-native";
import {Container, Form, Button, } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { registration } from "../API/firebaseMethods";
import InputBox from "./components/InputBox";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function SignUp({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
  const emptyState = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };
  const handlePress = () => {
    if (!name) {
<<<<<<< HEAD
      Alert.alert("Nafn ekki rétt sláð inn");
    } else if (name.length < 3) {
      Alert.alert("Nafn of stutt");
    } else if (!email) {
      Alert.alert("Vantar netfang");
    } else if (!password) {
      Alert.alert("Vantar lykilorð");
    } else if (!confirmPassword) {
      setPassword("");
      Alert.alert("Vantar staðfestingar lykilorð");
    } else if (password !== confirmPassword) {
      Alert.alert("Lykilorð passa ekki");
=======
     Alert.alert("Nafn ekki rétt sláð inn");
    } else if (name.length < 3) {
     Alert.alert("Nafn of stutt");
    } else if (!email) {
      Alert.alert("Vantar netfang");
    } else if (!password) {
      setPasswordError("Vantar lykilorð")
     Alert.alert("Vantar lykilorð");
    } else if (!confirmPassword) {
      setPassword("");
     Alert.alert("Vantar staðfestingar lykilorð");
    } else if (password !== confirmPassword) {
     Alert.alert("Lykilorð passa ekki");
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
    } else {
      registration(email, password, name);
      navigation.navigate("Loading");
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

<<<<<<< HEAD
  return (
    <View style={styles.container}>
      <Container style={styles.LoginContainer}>
        <Text style={styles.HeaderText}>Nýr notandi</Text>

        <Form>
          <View style={styles.FormContainer}>
            <View style={styles.EmailForm}>
              <Icon style={styles.Icons} name="person-outline" />
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
              <Icon style={styles.Icons} name="mail-outline" />
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
              <Icon style={styles.Icons} name="lock-closed-outline" />
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
              <Icon style={styles.Icons} name="lock-closed-outline" />
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
                <Text style={styles.text}>Nýskráning</Text>
              </Button>
            </View>
=======
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 50 : 0

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> 
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <Container style={styles.LoginContainer}>
         <KeyboardAvoidingView 
            behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
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

                  <View style={styles.LoginButtons}>
                    <Button style={styles.RegisterButton} full onPress={handlePress}>
                      <Text style={styles.text}>Nýskráning</Text>
                    </Button>
                  </View>
                </View>
              </Form>
              </KeyboardAvoidingView>
          <View style={styles.BottomContainer}>
            <Text style={styles.ContinueText}>Ertu nú þegar með með aðgang? </Text>
            <Button
              style={styles.ContinueButton}
              full
              success
              onPress={() => navigation.navigate("Sign In")}
            >
              <Text style={styles.ContinueTextBold}>Innskráning</Text>
            </Button>
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
          </View>

<<<<<<< HEAD
      <View style={styles.BottomContainer}>
        <Text style={styles.ContinueText}>Ertu nú þegar með með aðgang? </Text>
        <Button
          style={styles.ContinueButton}
          full
          success
          onPress={() => navigation.navigate("Sign In")}
        >
          <Text style={styles.ContinueTextBold}>Innskráning</Text>
        </Button>
      </View>
    </View>
=======
        </Container>
      </View>
    </SafeAreaView>
  </TouchableWithoutFeedback>
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
  );

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#F2F9F4",
=======
  }


const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: 'white',
    flex: 1
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "white",
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "space-around",
  },
  HeaderText: {
<<<<<<< HEAD
    color: "#56B980",
    fontSize: 40,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
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
  },
  FormContainer: {},
  LabelText: {
    color: "#56B980",
    fontSize: 20,
=======
    color: "#069380",
    fontSize: hp(5),
    fontWeight: "300",
    alignSelf: 'center'
  },
  text: {
    color: "#fff",
    fontSize: hp(2.5),
  },
  LoginContainer: {
    flex: 2,
    width: wp(75),
    height: hp(80),
    paddingTop: hp(10),
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
  },
  FormContainer: {},
  LoginButtons: {
    marginTop: hp(5),
  },
  RegisterButton: {
<<<<<<< HEAD
    margin: 15,
    backgroundColor: "#56B980",
=======
    marginHorizontal: wp(10),
    backgroundColor: "#069380",
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
    borderRadius: 20,
  },
  BottomContainer: {
    flex: 1,
<<<<<<< HEAD
    alignItems: "center",
    alignContent: "space-around",
    justifyContent: "flex-end",
    marginBottom: 36,
  },
  ContinueText: {
    color: "#56B980",
    fontSize: 20,
    paddingBottom: 10,
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
  },
  Icons: {
    color: "#56B980",
    paddingTop: 40,
  },
  InputBox: {
    borderBottomColor: "#56B980",
    alignSelf: "center",
    color: "#56B980",
  },
});
=======
    justifyContent: "flex-end",
    alignItems: 'center',
    paddingBottom: hp(2)
  },
  ContinueText: {
    color: "#069380",
    textAlign: 'center',
    fontSize: hp(2.5),
    paddingBottom: hp(1),
  },
  ContinueTextBold: {
    color: "#069380",
    fontSize: hp(2.5),
    fontWeight: "bold",
    alignSelf: 'center',
    textAlign: 'center',
  },
  ContinueButton: {
    backgroundColor: "white",
  },
});
>>>>>>> 817c503081a607add6bdd27f683024e9854b0388
