import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import logo from '../../assets/VLlogo.png';
// import latoFont from '../../assets/Fonts/Lato-Regular.ttf';
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
// firebase.initializeApp(firebaseConfig);

export default class Home extends React.Component {
    
    // constructor sem tekur inn email og password
    constructor(props) {
        super(props)

        this.state = ({
            email: '',
            password: ''
        })
    }
    
    // Þegar nýr notandi ætlar að skrá sig inn þá þarf að athuga fyrst hvort notandi noti amk 6 stafa lykilorð og hvort netfang sé á réttu formatti
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

    // Þegar notandi ætlar að skrá sig inn aftur þá þarf að athuga fyrst hvort notandi sé til
    loginUser = (email, password) => {

        try {

            firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
                console.log(user)
            })
        }
        catch (error) {
            console.log(error.toString())
        }
    }

    render() {
        const { navigation } = this.props;
        // const [toggleCheckBox, setToggleCheckBox] = useState(false);
        return (
            <View style={styles.container}>
                
                <Text style={styles.HeaderText}>Innskráning</Text>
                <StatusBar style="auto" />
                
                
                <Container style={styles.LoginContainer}>
                    <Form>
                    <View style={styles.EmailForm}>
                        <Icon style={styles.Icons}
                            name='mail'/>
                        <Item floatingLabel>
                            <Label style={styles.LabelText}>Netfang</Label> 
                            <Input
                                style={styles.InputBox}
                                autoCorrect={false}
                                autoCapitalize="none"
                                onChangeText={(email) => this.setState({ email })} // setur þennan input sem email
                            />
                        </Item>
                    </View>

                    <View style={styles.EmailForm}>
                        <Icon style={styles.Icons}
                            name='lock-closed-outline'
                            type='ionicon'
                        />
                        <Item floatingLabel>
                            <Label style={styles.LabelText}>Lykilorð</Label>
                            <Input
                                style={styles.InputBox}
                                secureTextEntry={true}
                                autoCorrect={false}
                                autoCapitalize="none"
                                onChangeText={(password) => this.setState({ password })} // setur þennan input sem password
                            />
                        </Item>
                    </View>
                    <View style={styles.ExtraOptions}>
                        <Text style={styles.ForgotPassword}>Gleymt lykilorð?</Text>
                    </View>
{/* <CheckBox
    disabled={false}
    value={toggleCheckBox}
    onValueChange={(newValue) => setToggleCheckBox(newValue)}
  /> */}
                        <View style={styles.LoginButtons}>
                            <Button style={styles.LoginButton}
                                full
                                onPress={() => this.loginUser(this.state.email, this.state.password)}> 
                                {/* // þegar ýtt er á Innskráning (login) þá fer hann í loginUser fallið og ath með email og password  */} 
                                <Text style={styles.text}>Skrá inn</Text>
                            </Button>
                        </View>
                    </Form>
                </Container>
                <View style={styles.BottomContainer}>
                    <Text style={styles.ContinueText}>Ertu ekki með aðgang? </Text>
                    <Button
                        style={styles.ContinueButton}
                        full
                        success
                        onPress={() => navigation.navigate("Nýskráning")}>
                        <Text style={styles.ContinueTextBold}> Nýskrá</Text>
                    </Button>
                   
                </View>
            </View>
        );
    };
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
    BottomContainer:{
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