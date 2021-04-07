import React, { Component, useEffect } from "react";
import MapView, { Polyline, Marker } from "react-native-maps";
import { StyleSheet, Text, LogBox, View, Dimensions, Image } from "react-native";
import * as Location from 'expo-location';
import * as firebase from 'firebase';
import 'firebase/firestore';

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

  render() {

    LogBox.ignoreLogs(['Setting a timer']);

    const { data, region } = this.state;

    return (
      <View style={styles.container}>
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