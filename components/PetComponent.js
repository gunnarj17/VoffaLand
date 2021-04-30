import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const { height } = Dimensions.get('window');



const PetComponent = ({ 
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
           ageString = age.years + " ára, " + age.months + " mánaða, og " + age.days + " daga";  
           else if ( (age.years > 0 && age.years <= 1) && (age.months > 0) && (age.days > 0) )  
           ageString = age.years + " árs, " + age.months + " mánaða, og " + age.days + " daga";  
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
                    <Text style={styles.textS}>{Name}</Text>
                </View>
                <View style={styles.center}> 
                    <Text style={styles.lefttextS}>Nafn: </Text>
                    <Text style={styles.lefttextS}>Tegund: </Text>
                    <Text style={styles.lefttextS}>Kyn: </Text>
                    <Text style={styles.lefttextS}>Aldur: </Text>
                    <Text style={styles.lefttextS}>Um: </Text>
                </View>
                <View style={styles.rightmost}>
                    <Text style={styles.textS}>{Name}</Text>
                    <Text style={styles.textS}>{Breed}</Text>
                    <Text style={styles.textS}>{Sex}</Text>
                    <Text style={styles.textS}>{ageCalculator(Birthday)}</Text>
                    <Text numberOfLines={lines ? 2 : null} style={styles.textS}>
                        {About}
                    </Text>
                    <TouchableOpacity onPress={() => setLines(!lines)} style={styles.seeContainer}>
                        <Text style={styles.textS}>
                            { lines ? 'See more' : 'Hide' }
                        </Text>
                    </TouchableOpacity>
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
        // marginHorizontal: wp(1),
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
    },
    textS: {
        color: 'white',
        fontSize: 18,
        paddingBottom: hp(1)
    },
    lefttextS: {
        color: 'white',
        fontSize: 18,
        textAlign: 'right',
        paddingBottom: hp(1)
    }
});

export default PetComponent
    