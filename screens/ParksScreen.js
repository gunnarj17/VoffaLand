import React, { Component, useEffect } from "react";
import MapView, { Polyline, Marker } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import * as Location from "expo-location";


export default class Parks extends Component {
  async componentDidMount() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
  }
  render() {
    const data = [
      {
        ID: "Geirsnef - Gerði og Lausaganga",
        Long: "64.12612328",
        Lat: "-21.84200201"
      },

      {
        ID: "Laugardalur - Gerði",
        Long: "64.13658123",
        Lat: "-21.87189907"
      },

      {
        ID: "Miðbær - Gerði hjá BSÍ ",
        Long: "64.13823974",
        Lat: "-21.93652234"
      },

      {
        ID: "Gerði í Breiðholti",
        Long: "64.10335303",
        Lat: "-21.8326539"
      },

      {
        ID: "Geldinganes - Lausaganga",
        Long: "64.15739269",
        Lat: "-21.7908133"
      },

      {
        ID: "Vatnsendahæð - Lausaganga",
        Long: "64.0938638",
        Lat: "-21.8179893"
      },

      {
        ID: "Við rauðavatn /Paradísardalur - Lausaganga",
        Long: "64.1125362",
        Lat: "-21.76679967"
      },

      {
        ID: "Ullarnesbrekka - Gerði",
        Long: "64.1730618",
        Lat: "-21.6820335"
      },
      {
        ID: "Úlfarsfell - Lausaganga",
        Long: "64.1379468",
        Lat: "-21.720829"
      },
      {
        ID: "Grafarvogur - Gerði",
        Long: "64.1413127",
        Lat: "-21.8002656"
      },
      {
        ID: "Silungapollur - Lausaganga",
        Long: "64.0837841",
        Lat: "-21.697526"
      },
      {
        ID: "Kleifarvatn - Lausaganga",
        Long: "63.94570399",
        Lat: "-21.95739883"
      },
      {
        ID: "Hundasvæðið í Hafnarfirði Völlum - Lausaganga",
        Long: "64.0372527",
        Lat: "-21.96880993"
      },
      {
        ID: "Hundasvæði í Garðarbæ / Bali - Lausaganga",
        Long: "64.07985872",
        Lat: "-21.98531353"
      },
      {
        ID: "Pétursborgir Akureyri - Lausaganga",
        Long: "65.72303685",
        Lat: "-18.14952509"
      },

      {
        ID: "Blómsturvellir Akureyri - Gerði",
        Long: "65.7204737",
        Lat: "-18.14422231"
      },

      {
        ID: "Akranes - Gerði",
        Long: "64.33096897",
        Lat: "-22.04650111"
      },

      {
        ID: "Hella - Gerði",
        Long: "63.843753",
        Lat: "-20.3992522"
      },

      {
        ID: "Selfoss - Gerði",
        Long: "63.92413774",
        Lat: "-20.98176182"
      },

      {
        ID: "Neskaupstaður - Lausaganga",
        Long: "65.14742791",
        Lat: "-13.73250922"
      },

      {
        ID: "Eskifjörður - Lausaganga",
        Long: "65.08396466",
        Lat: "-14.06490655"
      },

      {
        ID: "Reyðarfjörður - Lausaganga",
        Long: "65.0345533",
        Lat: "-14.3018818"
      },

      {
        ID: "Fáskrúðsfjörður - Lausaganga",
        Long: "64.9318163",
        Lat: "-14.0474796"
      },

      {
        ID: "Stöðvarfjörður - Lausaganga",
        Long: "64.8293776",
        Lat: "-13.8492107"
      },

      {
        ID: "Rockville Reykjanesbær - Lausaganga",
        Long: "64.03552693",
        Lat: "-22.65285856"
      },

      {
        ID: "Hveragerði - Gerði",
        Long: "63.98645198",
        Lat: "-21.10436177"
      },

      {
        ID: "Patterson - ósamþykkt svæði",
        Long: "63.9524524",
        Lat: "-22.5427437"
      },

      {
        ID: "Þorlákshöfn - Lausaganga",
        Long: "63.8672764",
        Lat: "-21.3801241"
      },

      {
        ID: "Vestmanneyjar - Lausaganga",
        Long: "63.4264834",
        Lat: "-20.2536392"
      },

      {
        ID: "Höfn í hornafirði - Lausaganga",
        Long: "64.2539638",
        Lat: "-15.1954007"
      },

      {
        ID: "Bolungarvík - Lausaganga",
        Long: "66.1489212",
        Lat: "-23.2277584"
      },

      {
        ID: "Ólafsfjörður - Lausaganga",
        Long: "66.0605085",
        Lat: "-18.7179136"
      },

      {
        ID: "Dalvík - Lausaganga",
        Long: "65.9778853",
        Lat: "-18.5487628"
      },

      {
        ID: "Siglufjörður - Lausaganga",
        Long: "66.125333",
        Lat: "-18.89085"
      }
    ];

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