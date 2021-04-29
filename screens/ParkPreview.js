// park preview
// import * as React from "react";
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,} from "react-native";
import { Icon, Button} from "native-base";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { useNavigation } from '@react-navigation/native';


const ParkPreview = React.forwardRef(({ props }, ref) => {
  const navigation = useNavigation();

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={styles.panelTop}>
        <Text style={styles.panelTitle}>{props && props.Name ? props.Name : "Vantar nafn"}</Text>
      </View>
      <View style={styles.panelBottom}>
        <View style={styles.panelLeft}>
          <View style={styles.iconView}>
            {/* Hérna þarf að birta actual stjörnugjöf sem svæðið hefur, þetta eru bara place-holder icons */}
            <Icon style={styles.Icons} name='star'/><Icon style={styles.Icons} name='star'/><Icon style={styles.Icons} name='star'/>
            {/* Hérna vantar líka að birta tögg-in sem svæðið hefur :) */}
          </View>
          <Text style={styles.leftText}> </Text>
        </View>
        <View style={styles.panelRight}>
          <Button
           style={styles.SeeMoreButton}
           onPress={() => { navigation.navigate('Selected Park',  props  ) }}>
              <Text style={styles.ButtonText}>Sjá nánar</Text>
          </Button>
        </View>
      </View>
    </View>
  );
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle}></View>
      </View>
    </View>
  );
  const fall = new Animated.Value(1);

  return (
    <BottomSheet
      ref={ref}
      snapPoints={[450, 0]}
      renderContent={renderInner}
      renderHeader={renderHeader}
      initialSnap={1}
      callbackNode={fall}
      enabledGestureInteraction={true}
    />
  );
});
export default ParkPreview;

const styles = StyleSheet.create({
  SeeMoreButton: {
    backgroundColor: "#069380",
    padding: 20,
    borderRadius: 20
  },
  ButtonText: {
    color: 'white',
    fontSize: 18
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    backgroundColor: "white",
  },
  panelTop: {
  },
  panelTitle: {
    fontSize: 24,
  },
  panelBottom: {
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom: 100 //Mjög mikil HAX leið, tökum þetta út þegar allar upplýsingarnar á þessu Bottom Sheet eru komnar inn!
  },
  panelLeft: {
    alignSelf: 'flex-start',
    padding: 10
  },
  iconView: {
    flexDirection: 'row'
  },
  Icons: {
    color: '#C4C4C4'
  },
  leftText: {
    fontSize: 18
  },
  rightText: {
    fontSize: 18,
  },
  panelRight: {
    alignSelf: 'flex-end',
    padding: 10
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#969696",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 80,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
});