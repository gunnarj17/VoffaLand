import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import logo from '../../assets/CorrectDoggo.png';
import { StatusBar } from 'expo-status-bar';


const Home = props => {
    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.VFtext}>VoffaLand </Text>
            <StatusBar style="auto" />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 200
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