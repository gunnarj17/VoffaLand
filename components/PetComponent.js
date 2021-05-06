import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PetModal from '../components/PetModal';

const { height } = Dimensions.get('window');

const PetComponent = ({ 
    Name, 
    Breed, 
    Photo,
}) => {
    return (
        <View style={styles.parent}>
            <View style={styles.container}>
                <View style={styles.leftmost}>
                    <Avatar
                        rounded
                        source={{
                            uri: Photo
                        }}
                        size='large'
                    />
                </View>

                <View style={styles.rightmost}>
                    <Text style={styles.textName}>{Name}</Text>
                    <Text style={styles.textBreed}>{Breed}</Text>
                </View>
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    parent: {
    },
    container: { 
        flexDirection: 'row',
        marginVertical: wp(2),
        borderRadius: 15,
        backgroundColor: '#81A5A1',
        padding: 10
    },
    leftmost: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center'
    },
    center: {
        flex: 1,
        paddingRight: wp(3),
    },
    rightmost: {
        flex: 2,
        alignSelf: 'center'
    },
    textName: {
        color: 'white',
        fontSize: 22,
        fontWeight: '400',
        paddingBottom: hp(1)
    },
    textBreed: {
        color: 'white',
        fontWeight: '300',
        fontSize: 18,
    },
    lefttextS: {
        color: 'white',
        fontSize: 18,
        textAlign: 'right',
        paddingBottom: hp(1)
    }
})
export default PetComponent