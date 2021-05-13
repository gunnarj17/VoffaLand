import React, {
  Component,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import Polyline from "@mapbox/polyline";
import {
  StyleSheet,
  Text,
  LogBox,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import * as Location from "expo-location";
import * as firebase from "firebase";
import "firebase/firestore";
import { Container, Item, Icon, Button, Input, Form } from "native-base";
import Option from "../components/Option"; // buttons for filter
import Card from "../components/Card"; // listing options from search and filter //  mögulega breytta þessu útliti í popupið hjá mariu?
import MapViewDirections from "react-native-maps-directions";
import HTML from "react-native-render-html";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { fetchRoute } from "../API/GoogleMap";
import apiKeys from "../config/keys";
import { getDistance, getPreciseDistance } from "geolib";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";

export default class Parks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      region: null,
      park: {},
      isFilterModalVisible: false,
      filterOption: {
        Fence: false,
        Free: false,
        isBrottganga: false,
        isGraslendi: false,
        isMol: false,
        isSjor: false,
        isSkogur: false,
        isTraut: false,
        isVatn: false,
        isMoi: false,
      },
      filterTowns: {
        capitalarea: false,
        south: false,
        north: false,
        east: false,
        west: false,
      },
      filteredParks: [],
      isLoading: false,
      search_key: "",
      parkList: [],
      destination: {
        GPS: null,
        distance: null,
        duration: null,
      },
      currentUserPosition: null,
      directionTitle: "",
      maneuver: "",
      nextManeuver: "",
      following: true,
    };

    this.onChangeUserLocation = this.onChangeUserLocation.bind(this);
  }

  onChangeUserLocation = (newLocation, setCamera, updateDirection = false) => {
    let currentUserPosition = {
      latitude: newLocation.coords.latitude,
      longitude: newLocation.coords.longitude,
    };
    //console.log('user location updated', newLocation)
    // For Test
    // let currentUserPosition = {
    //   latitude: 64.07287152431486,
    //   longitude: -21.948613737592083,
    // }
    /*if (setCamera) {
      this.mapRef.setCamera({
        center: currentUserPosition,
        pitch: 50,
        heading: 0,
        altitude: 200,
        zoom: 20
      })
    }*/

    this.setState({ currentUserPosition });

    if (updateDirection) {
      // Get Direction Description Info
      this.getDirectionInfo(
        currentUserPosition,
        setCamera,
        newLocation.coords.heading
      );
    }
  };

  getDirectionInfo = async (currentUserPosition, setCamera, heading) => {
    const { destination } = this.state;

    if (!destination) {
      try {
        this.mapRef.animateCamera({
          center: currentUserPosition,
        });
      } catch (e) {
        console.log(e);
      }
      return;
    }

    let directionTitle = "",
      origin,
      dest;
    if (currentUserPosition.latitude && currentUserPosition.longitude) {
      origin = `${currentUserPosition.latitude},${currentUserPosition.longitude}`;
    }
    if (destination.GPS.latitude && destination.GPS.longitude) {
      dest = `${destination.GPS.latitude},${destination.GPS.longitude}`;
    }
    const apiKey = apiKeys.extra.googleMapApiKey;
    const result = await fetchRoute(origin, dest, apiKey);
    //console.log('result: ', result)
    if (result && result.nextStep && result.nextStep.html_instructions) {
      directionTitle = result.nextStep.html_instructions;
      //console.log('direction title: ', directionTitle);

      let points = Polyline.decode(result.waypoints);
      let waypoints = points.map((point) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });

      console.log(result.maneuver);

      if (this.state.destination.GPS) {
        this.setDestination({
          duration: result.duration,
          distance: result.distance,
        });

        this.setState({
          directionTitle,
          maneuver: result.maneuver,
          nextManeuver: result.nextManeuver,
          distanceNextWaypoint: result.distanceNextWaypoint,
          waypoints,
          startLocation: {
            latitude: result.nextStep.start_location.lat,
            longitude: result.nextStep.start_location.lng,
          },
        });

        if (setCamera) {
          try {
            this.mapRef.animateCamera({
              center: {
                latitude: result.nextStep.start_location.lat,
                longitude: result.nextStep.start_location.lng,
              },
              pitch: 60,
              heading: this.bearing(
                waypoints[0].latitude,
                waypoints[0].longitude,
                waypoints[1].latitude,
                waypoints[1].longitude
              ),
              //heading: this.bearing(result.nextStep.start_location.lat, result.nextStep.start_location.lng, result.nextStep.end_location.lat, result.nextStep.end_location.lng),
              //heading: heading,
              altitude: 200,
              zoom: 18,
            });
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
  };

  // Converts from degrees to radians.
  toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  // Converts from radians to degrees.
  toDegrees(radians) {
    return (radians * 180) / Math.PI;
  }

  bearing = (startLat, startLng, destLat, destLng) => {
    startLat = this.toRadians(startLat);
    startLng = this.toRadians(startLng);
    destLat = this.toRadians(destLat);
    destLng = this.toRadians(destLng);

    let y = Math.sin(destLng - startLng) * Math.cos(destLat);
    let x =
      Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let brng = Math.atan2(y, x);
    brng = this.toDegrees(brng);
    return (brng + 360) % 360;
  };

  _getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    let region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0999,
      longitudeDelta: 0.0999,
    };

    this.setState({ region: region });
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    await this._getLocation();

    const documentSnapshot = await firebase
      .firestore()
      .collection("Parks")
      .get();

    let transformArray = [];

    let parkList = [];
    documentSnapshot.forEach(async (res) => {
      const { GPS, Name } = res.data();
      let parkObj = res.data();
      let townRef = parkObj.Town;
      let townName = "";
      if (townRef) {
        const townDoc = await firebase
          .firestore()
          .collection("Towns")
          .doc(townRef.id)
          .get();
        if (townDoc && townDoc.data()) townName = townDoc.data().Name;
      }

      parkObj.townName = townName;
      transformArray.push({
        ID: res.id,
        Name: Name,
        Long: GPS.longitude,
        Lat: GPS.latitude,
        park: parkObj,
      });

      parkList.push(parkObj);
    });

    this.setState({ data: transformArray, parkList, isLoading: false });

    this.location = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        enableHighAccuracy: true,
        distanceInterval: 0,
        timeInterval: 100,
      },
      (newLocation) => {
        this.onChangeUserLocation(newLocation, this.state.following, false);
      },
      (error) => console.log(error)
    );
    return this.location;
  }

  // Method to show Filter Modal
  showFilterModal = () => {
    this.setState({ isFilterModalVisible: true });
  };

  // Method to hide Filter Modal
  hideFilterModal = () => {
    this.setState({ filteredParks: [] });
    this.setState({ isFilterModalVisible: false });
  };

  // Method which handles clicking handle option
  _switchFilterOption = (key) => {
    let { filterOption } = this.state;
    let val = filterOption[key];
    filterOption[key] = !val;
    this.setState({ filterOption });
  };

  // Method which hanldes clicking town filter
  _switchFilterTown = (town) => {
    let { filterTowns } = this.state;
    let val = filterTowns[town];
    filterTowns[town] = !val;
    this.setState({ filterTowns });
  };

  // Method to perform filtering
  _handleFilter = () => {
    // Close Filter Modal
    this.hideFilterModal();
    this.setState({ isLoading: true });

    const { filterOption, filterTowns } = this.state;
    let filteredParks = [];
    firebase
      .firestore()
      .collection("Parks")
      .get()
      .then((querySnapshot) => {
        for (const documentSnapshot of querySnapshot.docs) {
          let snapshotData = documentSnapshot.data();
          let isValid = true;
          Object.keys(filterOption).forEach((key, index) => {
            if (filterOption[key]) {
              if (snapshotData[key]) isValid = true && isValid;
              else isValid = false;
            } else {
              isValid = true && isValid;
            }
          });

          let filterTownRef = snapshotData["Filtertowns"];

          // Handle filter based on filter towns
          if (isValid) {
            if (filterTowns[filterTownRef.id]) isValid = true;
            else {
              Object.keys(filterTowns).forEach((key, index) => {
                if (key != filterTownRef.id && filterTowns[key])
                  isValid = false;
              });
            }
          }

          if (isValid) {
            filteredParks.push(snapshotData);
          }
        }
        this.setState({ filteredParks });
      });
    this.setState({ isLoading: false });
  };

  // Method to handle change search key
  _changeSearchKey = (key) => {
    this.setState({ search_key: key });
    let filteredParks = [];
    const { parkList } = this.state;
    if (key == "") {
      filteredParks = [];
    } else {
      if (parkList.length > 0)
        parkList.forEach((park) => {
          if (park.Name.includes(key) || park.townName.includes(key))
            filteredParks.push(park);
        });
    }
    this.setState({ filteredParks });
  };

  renderFilterModal = () => {
    const { filterOption, filterTowns } = this.state;
    return (
      <View style={styles.filterModalArea}>
        <View style={styles.closeFilterButtonArea}>
          <Button
            style={styles.closeFilterButton}
            onPress={this.hideFilterModal}
          >
            <Image
              style={styles.filterIcon}
              source={require("../assets/filter.png")}
            />
          </Button>
        </View>
        <View style={styles.modalContent}>
          <View style={{ marginBottom: 10 }}>
            <View style={styles.optionTitleArea}>
              <Text style={styles.optionTitleText}>Tegund svæðis</Text>
            </View>
            <View style={styles.optionContainer}>
              <Option
                onPress={() => this._switchFilterOption("Free")}
                text="Lausaganga"
                isSelected={filterOption["Free"]}
              />
              <Option
                onPress={() => this._switchFilterOption("Fence")}
                text="Hundagerði"
                isSelected={filterOption["Fence"]}
              />
            </View>
          </View>
          <View style={{ marginBottom: 10 }}>
            <View style={styles.optionTitleArea}>
              <Text style={styles.optionTitleText}>Umhverfi</Text>
            </View>
            <View style={styles.optionContainer}>
              <Option
                onPress={() => this._switchFilterOption("isBrottganga")}
                text="Brött ganga"
                isSelected={filterOption["isBrottganga"]}
              />
              <Option
                onPress={() => this._switchFilterOption("isGraslendi")}
                text="Graslendi"
                isSelected={filterOption["isGraslendi"]}
              />
              <Option
                onPress={() => this._switchFilterOption("isMoi")}
                text="Mói"
                isSelected={filterOption["isMoi"]}
              />
              <Option
                onPress={() => this._switchFilterOption("isSjor")}
                text="Nálægt sjó"
                isSelected={filterOption["isSjor"]}
              />
              <Option
                onPress={() => this._switchFilterOption("isSkogur")}
                text="Skóglendi"
                isSelected={filterOption["isSkogur"]}
              />
              <Option
                onPress={() => this._switchFilterOption("isTraut")}
                text="Þrautabraut"
                isSelected={filterOption["isTraut"]}
              />
              <Option
                onPress={() => this._switchFilterOption("isVatn")}
                text="Nálægt vatni"
                isSelected={filterOption["isVatn"]}
              />
              <Option
                onPress={() => this._switchFilterOption("isMol")}
                text="Möl"
                isSelected={filterOption["isMol"]}
              />
            </View>
          </View>
          <View style={{ marginBottom: 10 }}>
            <View style={styles.optionTitleArea}>
              <Text style={styles.optionTitleText}>Staðsetning</Text>
            </View>
            <View style={styles.optionContainer}>
              <Option
                onPress={() => this._switchFilterTown("capitalarea")}
                text="Höfuðborgarsvæðið"
                isSelected={filterTowns["capitalarea"]}
              />
              <Option
                onPress={() => this._switchFilterTown("south")}
                text="Suðurland"
                isSelected={filterTowns["south"]}
              />
              <Option
                onPress={() => this._switchFilterTown("west")}
                text="Vesturland"
                isSelected={filterTowns["west"]}
              />
              <Option
                onPress={() => this._switchFilterTown("north")}
                text="Norðurland"
                isSelected={filterTowns["north"]}
              />
              <Option
                onPress={() => this._switchFilterTown("east")}
                text="Austurland"
                isSelected={filterTowns["east"]}
              />
            </View>
          </View>

          <View style={styles.actionContainer}>
            <Button onPress={this._handleFilter} style={styles.finishBtn}>
              <Text style={styles.finishBtnText}>Sía</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  };

  // Method to handle show path to destination Park from User Location.
  onShowRoute = async (park) => {
    this.props.navigation.setOptions({
      tabBarVisible: false,
    });
    this.setState({ filteredParks: [] });
    let { destination } = this.state;
    if (park.GPS && park.GPS.latitude) {
      const destination_gps = {
        latitude: park.GPS.longitude,
        longitude: park.GPS.latitude,
      };
      destination.GPS = destination_gps;

      this.setState({ destination });
    } else {
      this.setState({ destination: null });
    }

    // Starting Watch User Position
    // Watch User Position
    // let { status } = await Location.requestPermissionsAsync();
    // if (status !== "granted") {
    //   // alert("Permission to access location was denied");
    //   return;
    // }

    this.watchId = await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        timeInterval: 2000,
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 0,
      },
      (newLocation) => {
        this.onChangeUserLocation(newLocation, this.state.following, true);
      }
    );
  };

  // Method to show Filter or Search Result by List / þetta er notað til að sýna Filter eða search niðurstöður í lista
  _renderResultList = () => {
    const { filteredParks, currentUserPositon } = this.state;
    let userLat = this.state.region.latitude;
    let userLong = this.state.region.longitude;
    return (
      <ScrollView style={styles.resultList}>
        {filteredParks.length > 0 &&
          filteredParks.map((park, key) => {
            var dis = getPreciseDistance(
              { latitude: userLong, longitude: userLat },
              { latitude: park.GPS.latitude, longitude: park.GPS.longitude }
            );
            dis = dis / 1000;
            dis = dis.toFixed();
            console.log("UserLat", userLat, " userLong ", userLong);
            console.log(
              "Park1 latitude =",
              park.GPS.latitude,
              " Park1 longitude=",
              park.GPS.longitude
            );
            console.log("Distance", dis);
            return (
              <Card
                navigation={this.props.navigation}
                park={park}
                distance={dis}
                key={key}
                onClick={() => this.onShowRoute(park)}
              />
            );
          })}
      </ScrollView>
    );
  };

  _renderDirectionSymbol = (maneuver) => {
    switch (maneuver) {
      case "fork-left":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_fork_left.png")}
          />
        );
      case "fork-right":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_fork_right.png")}
          />
        );
      case "merge":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_merge_straight.png")}
          />
        );
      case "ramp-left":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_off_ramp_slight_left.png")}
          />
        );
      case "ramp-right":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_off_ramp_slight_right.png")}
          />
        );
      case "roundabout-left":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_roundabout_left.png")}
          />
        );
      case "roundabout-right":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_roundabout_right.png")}
          />
        );
      case "straight":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_roundabout_straight.png")}
          />
        );
      case "turn-left":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_turn_left.png")}
          />
        );
      case "turn-right":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_turn_right.png")}
          />
        );
      case "turn-sharp-left":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_turn_sharp_left.png")}
          />
        );
      case "turn-sharp-right":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_turn_sharp_right.png")}
          />
        );
      case "turn-slight-left":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_turn_slight_left.png")}
          />
        );
      case "turn-slight-right":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_turn_slight_right.png")}
          />
        );
      case "uturn-left":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_uturn.png")}
          />
        );
      case "uturn-right":
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_uturn.png")}
          />
        );
      default:
        return (
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../assets/icons/png/light/direction_continue.png")}
          />
        );
    }
  };

  renderResultList = () => {
    const { directionTitle, distanceNextWaypoint } = this.state;
    return (
      <View style={styles.filterArea}>
        {directionTitle == "" && (
          <View style={styles.actionArea}>
            <View style={styles.left}>
              <Item style={styles.searchArea}>
                <Input
                  style={styles.searchInputBox}
                  placeholder="Leita af svæði ..."
                  value={this.state.search_key}
                  onChangeText={(txt) => this._changeSearchKey(txt)}
                />
                <Icon active name="search" />
              </Item>

              {this._renderResultList()}
            </View>

            <Button style={styles.filterButton} onPress={this.showFilterModal}>
              <Image
                style={styles.filterIcon}
                source={require("../assets/filter.png")}
              />
            </Button>
          </View>
        )}
        {directionTitle != "" && (
          <View>
            <View style={styles.directonContainer}>
              {this._renderDirectionSymbol(this.state.maneuver)}
              <HTML
                source={{ html: directionTitle }}
                containerStyle={{ flex: 1 }}
                baseFontStyle={styles.directionText}
              />
            </View>
            {this.state.nextManeuver && (
              <View style={styles.nextDirectonContainer}>
                <Text style={styles.nextDirectionText}>Then</Text>
                {this._renderDirectionSymbol(this.state.nextManeuver)}
                <Text style={{ color: "white" }}>
                  in {distanceNextWaypoint}
                </Text>
              </View>
            )}

            <Button
              style={styles.showMyLocationButton}
              onPress={async () => {
                this.setState({ following: true });
                this.onChangeUserLocation(
                  await Location.getCurrentPositionAsync({
                    enableHighAccuracy: true,
                    accuracy: Location.Accuracy.BestForNavigation,
                  }),
                  true
                );
              }}
            >
              <MaterialIcons name="my-location" size={30} color="black" />
            </Button>
          </View>
        )}
      </View>
    );
  };

  onPressMapView = (event) => {
    this.setState({ filteredParks: [] });
    const { isFilterModalVisible } = this.state;
    if (isFilterModalVisible) this.setState({ isFilterModalVisible: false });
  };

  // Method to set distance and duration of the Destination
  setDestination = (result) => {
    let { destination } = this.state;
    destination.distance = result.distance;
    destination.duration = result.duration;
    this.setState({ destination });
  };

  exitRoute = () => {
    this.props.navigation.setOptions({ tabBarVisible: true });

    // Set the Camera Default
    try {
      this.mapRef.animateCamera({
        center: this.state.currentUserPosition,
        pitch: 0,
        heading: 0,
        altitude: 200,
        zoom: 12,
      });
    } catch (e) {
      console.log(e);
    }

    // Unsubscribe location watch
    this.watchId.remove();
    //clearInterval(this.watchId);
    //this.watchId = null;
    this.setState({
      destination: {
        GPS: null,
        distance: null,
        duration: null,
      },
      waypoints: null,
      currentUserPosition: null,
      directionTitle: "",
      maneuver: null,
      nextManeuver: null,
    });
  };

  renderRouteInfo = () => {
    const { destination } = this.state;
    if (destination.distance) {
      return (
        <View style={styles.pathInfoBar}>
          <View style={styles.infoWrapper}>
            <View>
              <Text style={styles.infoText}>{destination.duration}</Text>
              <Text style={styles.infoText}>{destination.distance}</Text>
            </View>

            <View>
              <Button style={styles.routeExitBtn} onPress={this.exitRoute}>
                <Text style={styles.exitText}>Exit</Text>
              </Button>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#034B42",
              zIndex: 0,
              position: "absolute",
            }}
          />
        </View>
      );
    } else return null;
  };

  bs = React.createRef();

  renderInner = (item) => {
    return (
      <View style={styles.panel}>
        <View style={styles.panelTop}>
          <Text style={styles.panelTitle}>
            {this.state.park && this.state.park.Name
              ? this.state.park.Name
              : "Vantar nafn"}
          </Text>
        </View>
        <View style={styles.panelBottom}>
          <View style={styles.panelLeft}>
            <View style={styles.iconView}>
              {/* Hérna þarf að birta actual stjörnugjöf sem svæðið hefur, þetta eru bara place-holder icons */}
              <Icon style={styles.Icons} name="star" />
              <Icon style={styles.Icons} name="star" />
              <Icon style={styles.Icons} name="star" />
              <Icon style={styles.Icons} name="star" />
              <Icon style={styles.Icons} name="star" />
              {/* Hérna vantar líka að birta tögg-in sem svæðið hefur :) */}
            </View>
            <Text style={styles.leftText}> </Text>
          </View>
          <View style={styles.panelRight}>
            <Button
              style={styles.SeeMoreButton}
              onPress={() => {
                this.props.navigation.navigate("SelectedPark", {
                  park: this.state.park,
                  goRoute: this.onShowRoute(),
                })
              }}
            >
              <Text style={styles.ButtonText}>Sjá nánar</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  };

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle}></View>
      </View>
    </View>
  );

  fall = new Animated.Value(1);

  render() {
    LogBox.ignoreLogs(["Setting a timer"]);

    const {
      data,
      region,
      isFilterModalVisible,
      destination,
      currentUserPosition,
      park,
      startLocation,
      waypoints,
      following,
    } = this.state;
    if (!region) return null;

    const openBottomSheet = (value) => {
      this.bs.current.snapTo(0);
      this.setState({ park: value });
    };

    return (
      <View style={styles.container}>
        <BottomSheet
          ref={this.bs}
          snapPoints={[450, 0]}
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
          initialSnap={1}
          callbackNode={this.fall}
          enabledGestureInteraction={true}
        />

        <MapView
          mapType={"standard"}
          style={styles.map}
          initialRegion={region}
          //showsUserLocation={true}
          //followsUserLocation={following}
          //onUserLocationChange={(a) => this.onChangeUserLocation(a.nativeEvent.coordinate, following)}
          onPress={(e) => this.onPressMapView(e)}
          provider={PROVIDER_GOOGLE}
          showsBuildings={false}
          showsIndoors={false}
          showsPointsOfInterest={false}
          ref={(ref) => {
            this.mapRef = ref;
          }}
          onPanDrag={() => this.setState({ following: false })}
          /*onUserLocationChange={destination.GPS ?
                      l => this.onChangeUserLocation(
                          {coords:
                                {latitude:
                                  l.nativeEvent.coordinate.latitude,
                                  longitude: l.nativeEvent.coordinate.longitude
                                }})
                  :
                      l => console.log(l.nativeEvent.coordinate)}*/
        >
          {data.map((m) => {
            return (
              <Marker
                key={m.ID}
                coordinate={{
                  latitude: parseFloat(m.Long),
                  longitude: parseFloat(m.Lat),
                }}
                title={m.ID}
                // þarf að breyta þessu í styttri lýsingu á svæði eða taka út.
                onPress={() => openBottomSheet(m.park)}
              >
                <Image
                  key={m.ID}
                  style={{ width: 30, height: 30 }}
                  source={require("../assets/dog.png")}
                />
              </Marker>
            );
          })}
          {/*{
            currentUserPosition &&
              <Marker
                coordinate={currentUserPosition}
                description="User Position"
              ><Image
                  style={{ width: 25, height: 25 }}
                  source={require("../assets/google_marker.png")}
                />
              </Marker>
          }*/}

          {(currentUserPosition || startLocation) && (
            <Marker
              coordinate={startLocation ? startLocation : currentUserPosition}
              //centerOffset={{x: 25, y: 25}}
              anchor={{ x: 0.5, y: 0.5 }}
              flat={true}
            >
              <Image
                style={{ width: 75, height: 75 }}
                source={require("../assets/location-icon.png")}
              />
            </Marker>
          )}
          {/*{
              destination.GPS &&
              <MapViewDirections
                  origin={currentUserPosition}
                  destination={destination.GPS}
                  waypoints={waypoints}
                  apikey={apiKeys.extra.googleMapApiKey}
                  strokeWidth={5}
                  strokeColor="#02907b"
                  mode="DRIVING"
                  optimizeWaypoints={true}
                  onError={(errorMessage) => {
                    console.log('errorMessage: ', errorMessage)
                  }}
                  onReady={result => {
                    this.setDestination(result)
                  }}
              />
            }*/}

          {destination.GPS && waypoints && (
            <MapView.Polyline
              coordinates={waypoints}
              strokeWidth={5}
              strokeColor="#02907b"
            />
          )}
        </MapView>
        {isFilterModalVisible
          ? this.renderFilterModal()
          : this.renderResultList()}
        {this.renderRouteInfo()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
  },
  actionArea: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  filterArea: {
    position: "absolute",
    width: "90%",
    left: "5%",
    top: 50,
  },
  left: {
    flex: 1,
  },
  searchArea: {
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: 5,
  },
  searchInputBox: {
    paddingLeft: 15,
  },
  filterButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 5,
  },
  filterIcon: {
    width: 40,
    height: 40,
  },
  filterModalArea: {
    position: "absolute",
    width: "90%",
    left: "5%",
    top: 50,
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  closeFilterButtonArea: {},
  modalContent: {
    marginTop: 50,
    paddingLeft: 5,
  },
  closeFilterButton: {
    position: "absolute",
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  optionContainer: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: 'space-between',
    alignItems: "center",
    flexWrap: "wrap",
  },
  optionTitleArea: {
    marginBottom: 10,
    marginLeft: 5,
  },
  optionTitleText: {
    fontSize: 20,
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  finishBtn: {
    borderWidth: 1,
    borderColor: "#02907b",
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  finishBtnText: {
    color: "#02907b",
    paddingLeft: 60,
    paddingRight: 60,
  },
  resultList: {
    maxHeight: 400,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 1,
  },
  infoWrapper: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 30,
    paddingRight: 20,
    zIndex: 1,
  },
  pathInfoBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 100,
    backgroundColor: "#034B42",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  routeExitBtn: {
    backgroundColor: "#C05C5C",
    borderRadius: 20,
  },
  exitText: {
    color: "white",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 18,
  },
  infoText: {
    color: "white",
    fontSize: 18,
  },
  directonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: "#034B42",
    borderRadius: 10,
    borderBottomLeftRadius: 0,
  },
  nextDirectonContainer: {
    display: "flex",
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8,
    paddingLeft: 8,
    backgroundColor: "#037a71",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  directionText: {
    marginLeft: 10,
    color: "white",
    fontSize: 18,
  },
  nextDirectionText: {
    marginLeft: 10,
    color: "white",
    fontSize: 14,
  },
  showMyLocationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginVertical: 16,
  },
  SeeMoreButton: {
    backgroundColor: "#069380",
    padding: 20,
    borderRadius: 20,
  },
  ButtonText: {
    color: "white",
    fontSize: 18,
  },
  panel: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    backgroundColor: "white",
  },
  panelTop: {},
  panelTitle: {
    fontSize: 24,
  },
  panelBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 100, //Mjög mikil HAX leið, tökum þetta út þegar allar upplýsingarnar á þessu Bottom Sheet eru komnar inn!
  },
  panelLeft: {
    alignSelf: "flex-start",
    padding: 10,
  },
  iconView: {
    flexDirection: "row",
  },
  Icons: {
    color: "#C4C4C4",
  },
  leftText: {
    fontSize: 18,
  },
  rightText: {
    fontSize: 18,
  },
  panelRight: {
    alignSelf: "flex-end",
    padding: 10,
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
    marginLeft: 10,
  },
  filterIcon: {
    width: 40,
    height: 40,
  },
});
