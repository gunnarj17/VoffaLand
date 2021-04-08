
import React, { Component, useEffect } from "react";
import MapView, { Polyline, Marker } from "react-native-maps";
import { StyleSheet, Text, LogBox, View, Dimensions, Image, Alert } from "react-native";
import * as Location from 'expo-location';
import { firebaseConfig } from '../API/Firebase';
import ParkPreview from './ParkPreview';
// Importing for Bottom Sheet
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import * as firebase from 'firebase';
import 'firebase/firestore';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default class Parks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      region: null,
    }
  }


  _getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    let region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0999,
      longitudeDelta: 0.0999
    }


    this.setState({ region: region });

  }

  async componentDidMount() {
    await this._getLocation();

    const documentSnapshot = await firebase.firestore().collection('Parks').get();

    let transformArray = [];

    documentSnapshot.forEach((res) => {

      const { GPS } = res.data();

      transformArray.push({
        ID: res.id,
        Long: GPS.longitude,
        Lat: GPS.latitude
      });

    });

    this.setState({ data: transformArray })
      
  }
  renderInner = () => (
    <Text> hi </Text>
  );
  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );
  
  bs = React.createRef();
  fall = new Animated.Value(1);

  render() {

    // The bottom sheet render function
    const openBottomSheet = value => () => {
      <ParkPreview name={value}/>
    };

    

    LogBox.ignoreLogs(['Setting a timer']);

    const { data, region } = this.state;

    return (
      <View style={styles.container}>  
        <BottomSheet
            ref={this.bs}
            snapPoints={[330, 0]}
            renderContent={this.renderInner}
            renderHeader={this.renderHeader}
            initialSnap={1}
            callbackNode={this.fall}
            enabledGestureInteraction={true}
          />      
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
        >
          {data.map((m) => {
            return (
              <Marker
                key={m.ID}
                coordinate={{
                  latitude: parseFloat(m.Long),
                  longitude: parseFloat(m.Lat)
                }}
                // Calling function to make bottom sheet appear
                // onPress={openBottomSheet(m.ID)}
                onPress={() => this.bs.current.snapTo(0)}
              >
                
                <Image
                  key={m.ID}
                  style={{ width: 25, height: 25 }}
                  source={require("../assets/dog.png")}
                />
              </Marker>
            );
          })}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});