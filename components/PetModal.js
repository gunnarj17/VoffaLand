import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, ScrollView, } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from 'react-native-modal';

const { height } = Dimensions.get('window');

const PetModal = ({ 
    isModalVisible, 
    toggleModal, 
    Id,
    Name, 
    Breed, 
    About, 
    Sex, 
    Birthday, 
    Photo,
    lines,
    setLines,
    navigation,
    deleteDog
}) => {

    function ageCalculator(dateString) {   
        if (dateString == undefined) {
            return;
        }

        var dob = new Date(dateString);

        var dobYear = dob.getYear();  
        var dobMonth = dob.getMonth();  
        var dobDate = dob.getDate();  
            
        var now = new Date();  

        var currentYear = now.getYear();  
        var currentMonth = now.getMonth(); 
        var currentDate = now.getDate();  
          
        var age = {};  
        var ageString = "";  
        
        var yearAge = currentYear - dobYear;  
          
        if (currentMonth >= dobMonth)  
          var monthAge = currentMonth - dobMonth;  
        else {  
          yearAge--;  
          var monthAge = 12 + currentMonth - dobMonth;  
        }  
      
        if (currentDate >= dobDate)  
          var dateAge = currentDate - dobDate;  
        else {  
          monthAge--;  
          var dateAge = 31 + currentDate - dobDate;  
      
          if (monthAge < 0) {  
            monthAge = 11;  
            yearAge--;  
          }  
        } 

        age = {  
            years: yearAge,  
            months: monthAge,  
            days: dateAge  
        };  
            
        if ( (age.years > 1) && (age.months > 0) && (age.days > 0) )  
           ageString = age.years + " ára, " + age.months + " mánaða og " + age.days + " daga";  
           else if ( (age.years > 0 && age.years <= 1) && (age.months > 0) && (age.days > 0) )  
           ageString = age.years + " árs, " + age.months + " mánaða og " + age.days + " daga";  
        else if ( (age.years == 0) && (age.months == 0) && (age.days > 0) )  
           ageString = "Bara " + age.days + " daga";  
        else if ( (age.years > 0) && (age.months == 0) && (age.days == 0) )  
           ageString = age.years +  " ár";  
        else if ( (age.years > 0) && (age.months > 0) && (age.days == 0) )  
           ageString = age.years + " ára og " + age.months + " mánaða";  
        else if ( (age.years == 0) && (age.months > 0) && (age.days > 0) )  
           ageString = age.months + " mánaða " + age.days + " daga";  
        else if ( (age.years > 0) && (age.months == 0) && (age.days > 0) )  
           ageString = age.years + " ára, og " + age.days + " daga";  
        else if ( (age.years == 0) && (age.months > 0) && (age.days == 0) )  
           ageString = age.months + " mánaða";  
        else ageString = "Þetta er fyrsti dagurinn";   

        return ageString;

    }  

    return (
        <Modal 
            isVisible={isModalVisible} 
            animationType="slide"
            coverScreen={false}
            deviceHeight={height}
            hasBackdrop={false}
        >
            {  Platform.OS === 'android' ?
                <StatusBar backgroundColor='rgba(0,0,0,0.5)' />
            : null
            }
            <View style={styles.container}>
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={toggleModal} style={styles.closeIcon}>
                        <AntDesign name="closecircleo" size={24} color="black" />
                    </TouchableOpacity>
                    <Avatar
                        rounded
                        source={{
                            uri: Photo
                        }}
                        size='xlarge'
                        containerStyle={styles.img}
                    />
                    <Text style={styles.dogNameText}>
                        {Name}
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('addDogs', {
                                dogId: Id, 
                                dogName: Name, 
                                dogBreed: Breed, 
                                dogDescription: About, 
                                dogSex: Sex, 
                                dogBirthday: Birthday, 
                                dogPhoto: Photo
                            })} 
                            style={styles.editButtonContainer}
                        >
                            <AntDesign name="edit" size={hp(2.5)} color="white" />
                            
                        </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteDog(Id)} style={styles.deleteButtonContainer}>
                            <AntDesign name="delete" size={hp(2.5)} color="white" />
                            
                        </TouchableOpacity>
                        </View>
                    <View style={styles.detailContainer}>
                        <Text style={styles.fontSizes}>
                            Tegund:
                        </Text>
                        <Text style={styles.descriptionText}>
                        {Breed}
                        </Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <Text style={styles.fontSizes}>
                            Kyn:
                        </Text>
                        <Text style={styles.descriptionText}>
                        {Sex}
                        </Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <Text style={styles.fontSizes}>
                            Aldur:
                        </Text>
                        <Text style={styles.descriptionText}>
                        {ageCalculator(Birthday)}
                        </Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <Text style={styles.fontSizes}>
                            Um Voffa:
                        </Text>
                        <Text numberOfLines={lines ? 2 : null} style={styles.descriptionText}>
                            {About}
                        </Text>
                        <TouchableOpacity onPress={() => setLines(!lines)} style={styles.seeContainer}>
                            <Text style={styles.seemoreText}>
                                { lines ? 'See more' : 'Hide' }
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonViewContainer}>
                        
                        
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    container: { 
        height: hp(75),
        backgroundColor: '#FCFCFC',
        borderRadius: 20,
        padding: wp(1.5),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    closeIcon: { 
        alignSelf: 'flex-end', 
        marginRight: wp(4), 
        marginTop: hp(2) 
    },
    img: {
        marginTop: hp(1),
        alignSelf: 'center',
        width: wp(40),
        height: wp(40),
        borderWidth: .8
    },
    dogNameText: { 
        marginTop: hp(2), 
        textAlign: 'center', 
        fontWeight: '300', 
        color: '#03738C', 
        fontSize: hp(4), 
    },
    fontSizes: { 
        fontSize: hp(2.4),
        fontWeight: '500',
        color: '#03738C',
        
    },
    detailContainer: { 
        marginLeft: wp(3),
        marginTop: hp(2) 
    },
    descriptionText: { 
        fontSize: hp(2.3),
        marginTop: hp(0.5), 
        paddingRight: wp(2)
    },
    seeContainer: { 
        alignSelf: 'center', 
        marginTop: hp(1)
    },
    seemoreText: { 
        textDecorationLine: 'underline' 
    },
    buttonViewContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-evenly', 
        marginTop: hp(5),
        marginBottom: hp(4)
    },
    editButtonContainer: { 
        flexDirection: 'row', 
        backgroundColor: '#81A5A1', 
        borderRadius: 50, 
        paddingHorizontal: 15, 
        alignItems: 'center',
        marginRight: wp(2),
        padding: wp(3.5)
    },
    deleteButtonContainer: { 
        flexDirection: 'row', 
        backgroundColor: '#F56A6D', 
        borderRadius: 50, 
        paddingHorizontal: 15, 
        alignItems: 'center',
        marginLeft: wp(2),
        padding: wp(3.5)
    },
    buttonContainer: {
        justifyContent: 'center',
        padding: wp(2),
        flexDirection: 'row'
    }
});

export default PetModal
