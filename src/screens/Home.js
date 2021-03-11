import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
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
// available in the SDK (SEEMS LIKE IT IS UNESESARY)
// firebase.initializeApp(firebaseConfig);

const Home = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.VFtext}>VoffaLand </Text>
            <Button
                full
                success
                onPress={() => navigation.navigate("Hundasvæði")}>
                <Text>Skoða VoffaLand án innskráningu</Text>
            </Button>
            <StatusBar style="auto" />
            <Container style={styles.container}>
                <Form>
                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input
                            autoCorrect={false}
                            autoCapitalize="none"
                        />
                    </Item>
                    <Item floatingLabel>
                        <Label>Password</Label>
                        <Input
                            secureTextEntry={true}
                            autoCorrect={false}
                            autoCapitalize="none"
                        />
                    </Item>
                    <Button
                        full
                        rounded
                        success>
                        <Text>Login</Text>
                    </Button>
                </Form>
            </Container>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: 200
    },
    logo: {
        width: 300,
        height: 300,
    },
    VFtext: {
        color: '#26A280',
        fontSize: 50,
        fontWeight: "bold",
    }
});

export default Home;