import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Container, Form, Button, } from "native-base";
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
  const emptyState = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };
  const handlePress = () => {
    if (!name) {
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
    } else {
      registration(email, password, name);
      navigation.navigate("Loading");
      emptyState();
    }
  };

  // Vil gera einhver cool error messages hérna, frekar en þetta Alert
  const inputNameChange = (value) => {
    setName(value)
    if (value.length < 3) {
      // setSome Error
    }
    else {
      // clear the error aka setja sem ''
    }
  }

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
            </View>

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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "space-around",
  },
  HeaderText: {
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
  },
  FormContainer: {},
  LoginButtons: {
    marginTop: hp(5),
  },
  RegisterButton: {
    marginHorizontal: wp(10),
    backgroundColor: "#069380",
    borderRadius: 20,
  },
  BottomContainer: {
    flex: 1,
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
