// park preview
// import * as React from "react";
import React, { useState, useEffect } from 'react';
import {Image, StyleSheet, Text, View,} from "react-native";
import { Icon, Button} from "native-base";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { useNavigation } from '@react-navigation/native';


const ParkPreview = React.forwardRef(({ park, showRoute }, ref) => {
  const navigation = useNavigation();

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={styles.panelTop}>
        <Text style={styles.panelTitle}>{park && park.Name ? park.Name : "Vantar nafn"}</Text>
      </View>
      <View style={styles.panelBottom}>
        <View style={styles.panelLeft}>
          <View style={styles.iconView}>
            {/* Hérna þarf að birta actual stjörnugjöf sem svæðið hefur, þetta eru bara place-holder icons */}
            <Icon style={styles.Icons} name='star'/><Icon style={styles.Icons} name='star'/><Icon style={styles.Icons} name='star'/><Icon style={styles.Icons} name='star'/><Icon style={styles.Icons} name='star'/>
            {/* Hérna vantar líka að birta tögg-in sem svæðið hefur :) */}

            <Button style={styles.filterButton} onPress={showRoute ? () => showRoute(park) : ()=>{}}>
              <Image
                  style={styles.filterIcon}
                  source={require("../assets/direct.png")}
              />
            </Button>
          </View>
          <Text style={styles.leftText}> </Text>
        </View>
      </View>
      <View style={styles.panelRight}>
        <Button
            style={styles.SeeMoreButton}
            onPress={() => { navigation.navigate('Selected Park',  park  ) }}>
          <Text style={styles.ButtonText}>Sjá nánar</Text>
        </Button>
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
      snapPoints={[500, 0]}
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 20
  },
  filterIcon: {
    width: 40,
    height: 40
  },
  panel: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: "white",
    paddingBottom: 100
  },
  panelTop: {
  },
  panelTitle: {
    fontSize: 24,
    paddingLeft: 10
  },
  panelBottom: {
    flexDirection:'row',
    justifyContent:'space-between',
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
