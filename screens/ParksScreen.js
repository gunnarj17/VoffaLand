import React, { Component, useEffect } from "react";
import MapView, { Polyline, Marker } from "react-native-maps";
import { StyleSheet, Text, LogBox, View, Dimensions, Image } from "react-native";
import * as Location from "expo-location";
import { firebaseConfig } from '../API/Firebase';


import * as firebase from 'firebase';
import 'firebase/firestore';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default class Parks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }
  async componentDidMount() {
    // let { status } = await Location.requestPermissionsAsync();
    // if (status !== "granted") {
    //   alert("Permission to access location was denied");
    //   return;
    // }

    let location = await Location.getCurrentPositionAsync({});

    const documentSnapshot = await firebase.firestore().collection('Parks').get();

        let transformArray = [];

        documentSnapshot.forEach((res) => {

          const { GPS } = res.data();

          transformArray.push({
            Id: res.id,
            Long: GPS.k,
            Lat: GPS.U 
          });

        });

        this.setState({ data: transformArray })
      
  }

  render() {

    LogBox.ignoreLogs(['Setting a timer']);

    const { data } = this.state;

    console.log(data)

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 64.12612328,
            longitude: -21.84200201,
            latitudeDelta: 0.0999,
            longitudeDelta: 0.0999
          }}
        >
          {data.map((m) => {
            return (
              <Marker
              key={m.ID}
                coordinate={{
                  latitude: parseFloat(m.Long),
                  longitude: parseFloat(m.Lat)
                }}
                title={m.ID}
                description="Description"
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