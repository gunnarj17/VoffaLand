import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Container, Button } from 'native-base';
import logo from '../assets/VLlogo.png';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function WelcomeScreen({ navigation }) {
  return (

    <View style={styles.ParentContainer}>

      <Container style={styles.LoginContainer}>
        <Image source={logo} style={styles.logo} />

        <View style={styles.Buttons}>
        
        <TouchableOpacity style={styles.LoginButton}
          onPress={() => navigation.navigate('Sign In')}>
          <LinearGradient colors={['#61BE80', '#5BBB80', '#069380']} style={styles.GradientButton}>
            <Text style={styles.LoginText}>Innskráning</Text>
          </LinearGradient>
        </TouchableOpacity>

          <Button style={styles.RegisterButton}
            full
            onPress={() => navigation.navigate('Sign Up')}>
            <Text style={styles.RegisterText}>Nýskráning</Text>
          </Button>
        </View>

      </Container>

    </View>
  )
}

const styles = StyleSheet.create({
  ParentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 250,
    height: 250,
  },
  
  LoginContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: 270,
    height: 200,
    backgroundColor: 'white',
    marginBottom: 30
  },

  Buttons: {
    marginTop: 30,
    marginBottom: 30,
  },
  GradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 16,
  },
  LoginButton: {
    marginTop: 10,
    marginBottom: 10,
    height: 60,
  },

  RegisterButton: {
    marginTop: 10,
    marginBottom: 10,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#069380'
  },

  LoginText: {
    color: '#fff',
    fontSize: 20,
    // fontFamily: Lato-Regular
  },
  RegisterText: {
    color: '#069380',
    fontSize: 20,
  },

});