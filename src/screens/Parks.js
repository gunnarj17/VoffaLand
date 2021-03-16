import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Parks = props => {
    return (
        <View style={styles.container}>
            <Text style={styles.VFtext}>Hérna koma hundasvæði</Text>
            <StatusBar style="auto" />
        </View >
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
    VFtext: {
        color: '#26A280',
        fontSize: 50,
        fontWeight: "bold",
    }
});

export default Parks;