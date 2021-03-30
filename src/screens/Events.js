import React from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import logo from '../../assets/VLlogo.png';


export default class Home extends React.Component {
    
    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.HeaderText}>Events, coming soon...</Text>
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
        fontSize: 40,
        fontWeight: "bold",
        justifyContent: 'center',
        alignItems: 'center',
    }
});