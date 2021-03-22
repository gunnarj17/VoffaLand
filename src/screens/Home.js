import React from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import logo from '../../assets/VLlogo.png';
// import latoFont from '../../assets/Fonts/Lato-Regular.ttf';
import { StatusBar } from 'expo-status-bar';
import { Container, Content, Header, From, Input, Item, Label, Form, Button, Icon } from 'native-base';
import Expo from 'expo';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';


export default class Home extends React.Component {
    
    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <Image source={logo} style={styles.logo} />
                {/* <Text style={styles.HeaderText}>VoffaLand</Text> */}
                <StatusBar style="auto" />
                
                <Container style={styles.LoginContainer}>
                    
                        <View style={styles.LoginButtons}>
                            <Button style={styles.LoginButton}
                                full
                                onPress={() => navigation.navigate("Innskráning")}>
                                <Text style={styles.text}>Innskráning</Text>
                            </Button>

                            <Button style={styles.RegisterButton}
                                full
                                onPress={() => navigation.navigate("Nýskráning")}>
                                <Text style={styles.RegisterText}>Nýskráning</Text>
                            </Button>
                            </View>
                    </Container>

                <Button
                    style={styles.ContinueButton}
                    full
                    success
                    onPress={() => navigation.navigate("Hundasvæði")}>
                    <Text style={styles.ContinueText}>Halda áfram án innskráningar</Text>
                </Button>
            </View>
        );
    };
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#F2F9F4',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignContent: 'space-around',
    },
    logo: {
        width: 250,
        height: 250,
        marginTop: 10
    },
    HeaderText: {
        color: '#26A280',
        fontSize: 30,
        fontWeight: "bold",
        justifyContent: 'center',
        alignItems: 'center',
       
    },
    LoginContainer: {
        flex: 1,
        width: 270,
        height: 200,
        backgroundColor: '#F2F9F4'
    },
    login: {
        marginTop: 10,
    },
    
    text: {
        color: '#fff',
        fontSize: 20,
        // fontFamily: Lato-Regular
    },
    LoginButtons: {
        marginTop: 30,
        marginBottom: 30,
    },
    LoginButton: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#56B980',
        borderRadius: 10
    },
    RegisterButton: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#F2F9F4',
        borderRadius:  10,
        borderWidth: 1.5,
        borderColor: '#56B980'
    },
    RegisterText: {
        color: '#56B980',
        fontSize: 20,
    },
    ContinueText: {
        color: '#56B980',
        fontSize: 15,
        fontWeight: 'bold'
    },
    ContinueButton: {
        backgroundColor: '#F2F9F4',
        marginBottom: 40
    }
});