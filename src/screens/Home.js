import React from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import logo from '../../assets/CorrectDoggo.png';
import { StatusBar } from 'expo-status-bar';
import { Container, Content, Header, From, Input, Item, Label, Form, Button, Icon } from 'native-base';

// this gives us the capability of using all the firebase methods in our application
import * as firebase from 'firebase';

//initialize firebase storing all the information regarding our firebase application
const firebaseConfig = {
    apiKey: "AIzaSyDtvmX8T-1N5OBBXVij228d0QtWkuORYpg",
    authDomain: "voffaland-2db0c.firebaseapp.com",
    databaseURL: "https://voffaland-2db0c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "voffaland-2db0c",
    storageBucket: "voffaland-2db0c.appspot.com",
};

// run the firebase initialize app with the firebase config then we can run the firebase functions that are
// available in the SDK
firebase.initializeApp(firebaseConfig);

export default class Home extends React.Component {

    constructor(props) {
        super(props)

        this.state = ({
            email: '',
            password: ''
        })
    }

    signUpUser = (email, password) => {

        try {

            if (this.state.password.length < 6) {
                alert("Vinsamlegast veldu að minnsta kosti 6 stafa lykilorð.")
                return;
            }

            firebase.auth().createUserWithEmailAndPassword(email, password)
        }
        catch (error) {
            console.log(error.toString())
        }
    }

    loginUser = (email, password) => {

        try {

            firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
                console.log(user)
            })
        }
        catch (error) {
            console.log(error.toString())
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.VFtext}>VoffaLand </Text>
                <StatusBar style="auto" />
                <Button
                    full
                    success
                    onPress={() => navigation.navigate("Hundasvæði")}>
                    <Text style={styles.text}>Skoða VoffaLand án innskráningu</Text>
                </Button>
                <Container>
                    <Form>
                        <Item floatingLabel>
                            <Label>Tölvupóstur</Label>
                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                onChangeText={(email) => this.setState({ email })}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Lykilorð</Label>
                            <Input
                                secureTextEntry={true}
                                autoCorrect={false}
                                autoCapitalize="none"
                                onChangeText={(password) => this.setState({ password })}
                            />
                        </Item>
                        <Button style={styles.login}
                            full
                            rounded
                            success
                            onPress={() => this.loginUser(this.state.email, this.state.password)}
                        >
                            <Text style={styles.text}>Innskráning</Text>
                        </Button>
                        <Button style={styles.login}
                            full
                            rounded
                            Primary
                            onPress={() => this.signUpUser(this.state.email, this.state.password)}
                        >
                            <Text style={styles.text}>Nýskráning</Text>
                        </Button>
                    </Form>
                </Container>
            </View>
        );
    };
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    VFtext: {
        color: '#26A280',
        fontSize: 40,
        fontWeight: "bold",
        justifyContent: 'center',
        alignItems: 'center',
    },
    login: {
        marginTop: 10,
    },
    text: {
        color: 'white',
    }
});