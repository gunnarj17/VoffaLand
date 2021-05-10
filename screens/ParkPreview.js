// park preview
// import * as React from "react";
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,Image} from "react-native";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { useNavigation } from '@react-navigation/native';


const ParkPreview = () => {
  const navigation = useNavigation();

}
;
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft:10,
},
filterIcon: {
    width: 40,
    height: 40
},
});