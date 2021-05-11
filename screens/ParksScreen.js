  
import React, { Component, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import { StyleSheet, Alert, Text, LogBox, View, Dimensions, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import * as Location from 'expo-location';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons'; 
import {
  Container,
  Item,
  Icon,
  Button,
  Input,
  Form
} from 'native-base';
import MapViewDirections from 'react-native-maps-directions';
import HTML from "react-native-render-html";
import { Feather } from '@expo/vector-icons';
import ParkPreview from './ParkPreview';

import Option from '../components/Option'; // buttons for filter
import Card from '../components/Card'; // listing options from search and filter //  mögulega breytta þessu útliti í popupið hjá mariu?
import apiKeys from '../config/keys';

import { fetchRoute } from '../API/GoogleMap';
export default class Parks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      region: null,
      isFilterModalVisible: false,
      filterOption: {
        'Fence': false,
        'Free': false,
        'isBrottganga': false,
        'isGraslendi': false,
        'isMol': false,
        'isSjor': false,
        'isSkogur': false,
        'isTraut': false,
        'isVatn': false,
        'isMoi': false
      },
      filterTowns: {
        capitalarea: false,
        south: false,
        north: false,
        east: false,
        west: false
      },
      filteredParks: [],
      isLoading: false,
      search_key: '',
      parkList: [],
      destination: {
        GPS: null,
        distance: null,
        duration: null
      },
      currentUserPosition: null,
      directionTitle: '',
      maneuver: ''
    }
  }

  onChangeUserLocation = (newLocation) => {
    let currentUserPosition = {
      latitude: newLocation.coords.latitude,
      longitude: newLocation.coords.longitude,
    }
    console.log('user location updated', newLocation)
    // For Test
    // let currentUserPosition = {
    //   latitude: 64.07287152431486,
    //   longitude: -21.948613737592083,
    // }
    this.mapRef.setCamera({
      center: currentUserPosition,
      pitch: 1000, 
      heading: 0,
      altitude: 200, 
      zoom: 50
    })

    this.setState({ currentUserPosition });
    // Get Direction Description Info
    this.getDirectionInfo(currentUserPosition);
  }

  getDirectionInfo = async (currentUserPosition) => {
    const { destination } = this.state;

    let directionTitle = '', origin, dest;
    if (currentUserPosition.latitude && currentUserPosition.longitude) {
      origin = `${currentUserPosition.latitude},${currentUserPosition.longitude}`;
    }
    if (destination.GPS.latitude && destination.GPS.longitude) {
      dest = `${destination.GPS.latitude},${destination.GPS.longitude}`;
    }
    const apiKey = apiKeys.extra.googleMapApiKey;
    const result = await fetchRoute(
      origin,
      dest,
      apiKey
    )
    console.log('result: ', result)
    if (result && result.nextStep && result.nextStep.html_instructions) {
      directionTitle = result.nextStep.html_instructions;
      maneuver = result.nextStep.maneuver ? result.nextStep.maneuver : '';
      console.log('direction title: ', directionTitle);
      this.setState({ directionTitle, maneuver });
    }
  }

  _getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }
    // Get Current Position
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
    this.setState({ isLoading: true });
    await this._getLocation();
    const documentSnapshot = await firebase.firestore().collection('Parks').get();
    let transformArray = [];
    let parkList = []
    documentSnapshot.forEach(async (res) => {
      const { GPS, Name, Information } = res.data();
      let parkObj = res.data();

      let townRef = parkObj.Town;
      let townName = ''
      if (townRef) {
        const townDoc = await firebase.firestore().collection('Towns').doc(townRef.id).get();
        if (townDoc && townDoc.data())
          townName = townDoc.data().Name;
      }

      parkObj.townName = townName;
      transformArray.push({
        ID: res.id,
        Name: Name,
        Information: Information,
        Long: GPS.longitude,
        Lat: GPS.latitude
      });

      parkList.push(parkObj)
    });

    this.setState({ data: transformArray, parkList, isLoading: false })

  }

  // Method to show Filter Modal
  showFilterModal = () => {
    this.setState({ isFilterModalVisible: true })
  }

  // Method to hide Filter Modal
  hideFilterModal = () => {
    this.setState({ filteredParks: [] })
    this.setState({ isFilterModalVisible: false })
  }

  // Method which handles clicking handle option
  _switchFilterOption = (key) => {
    let { filterOption } = this.state;
    let val = filterOption[key];
    filterOption[key] = !val;
    this.setState({ filterOption });
  }

  // Method which hanldes clicking town filter
  _switchFilterTown = (town) => {
    let { filterTowns } = this.state;
    let val = filterTowns[town];
    filterTowns[town] = !val;
    this.setState({ filterTowns });
  }

  // Method to perform filtering
  _handleFilter = () => {
    // Close Filter Modal
    this.hideFilterModal();
    this.setState({ isLoading: true });

    const { filterOption, filterTowns } = this.state;
    let filteredParks = [];
    firebase.firestore().collection('Parks').get().then(querySnapshot => {
      for (const documentSnapshot of querySnapshot.docs) {
        let snapshotData = documentSnapshot.data();
        let isValid = true;
        Object.keys(filterOption).forEach((key, index) => {
          if (filterOption[key]) {
            if (snapshotData[key])
              isValid = true && isValid;
            else
              isValid = false;
          } else {
            isValid = true && isValid;
          }
        });

        let filterTownRef = snapshotData['Filtertowns'];

        // Handle filter based on filter towns
        if (isValid) {
          if (filterTowns[filterTownRef.id])
            isValid = true;
          else {
            Object.keys(filterTowns).forEach((key, index) => {
              if ((key != filterTownRef.id) && filterTowns[key])
                isValid = false;
            });
          }
        }

        if (isValid) {
          filteredParks.push(snapshotData)
        }
      }
      this.setState({ filteredParks })
    });
    this.setState({ isLoading: false });
  }

  // Method to handle change search key
  _changeSearchKey = (key) => {
    this.setState({ search_key: key });
    let filteredParks = [];
    const { parkList } = this.state;
    if (key == '') {
      filteredParks = [];
    }
    else {
      if (parkList.length > 0)
        parkList.forEach(park => {
          if (park.Name.includes(key) || park.townName.includes(key))
            filteredParks.push(park);
        })
    }
    this.setState({ filteredParks });
  }
// LookHere
  renderFilterModal = () => {
    const { filterOption, filterTowns } = this.state;
    return (
      <View style={styles.filterModalArea}>
        <View style={styles.closeFilterButtonArea}>
          <Button style={styles.closeFilterButton} onPress={this.hideFilterModal}>
            {/* <Image
              style={styles.filterIcon}
              source={require("../assets/filter.png")}
            /> */}
            <MaterialIcons name="tune" size={24} color="white" style={{paddingLeft: 7}} />
          </Button>
        </View>
        <View style={styles.modalContent}>
          <View style={{ marginBottom: 10 }}>
            <View style={styles.optionTitleArea}>
              <Text style={styles.optionTitleText}>Tegund svæðis</Text>
            </View>
            <View style={styles.optionContainer}>
              <Option onPress={() => this._switchFilterOption('Free')} text="Lausaganga" isSelected={filterOption['Free']} />
              <Option onPress={() => this._switchFilterOption('Fence')} text="Hundagerði" isSelected={filterOption['Fence']} />
            </View>
          </View>
          <View style={{ marginBottom: 10 }}>
            <View style={styles.optionTitleArea}>
              <Text style={styles.optionTitleText}>Umhverfi</Text>
            </View>
            <View style={styles.optionContainer}>
              <Option onPress={() => this._switchFilterOption('isBrottganga')} text="Brött ganga" isSelected={filterOption['isBrottganga']} />
              <Option onPress={() => this._switchFilterOption('isGraslendi')} text="Graslendi" isSelected={filterOption['isGraslendi']} />
              <Option onPress={() => this._switchFilterOption('isMoi')} text="Mói" isSelected={filterOption['isMoi']} />
              <Option onPress={() => this._switchFilterOption('isSjor')} text="Nálægt sjó" isSelected={filterOption['isSjor']} />
              <Option onPress={() => this._switchFilterOption('isSkogur')} text="Skóglendi" isSelected={filterOption['isSkogur']} />
              <Option onPress={() => this._switchFilterOption('isTraut')} text="Þrautabraut" isSelected={filterOption['isTraut']} />
              <Option onPress={() => this._switchFilterOption('isVatn')} text="Nálægt vatni" isSelected={filterOption['isVatn']} />
              <Option onPress={() => this._switchFilterOption('isMol')} text="Möl" isSelected={filterOption['isMol']} />
            </View>
          </View>
          <View style={{ marginBottom: 10 }}>
            <View style={styles.optionTitleArea}>
              <Text style={styles.optionTitleText}>Staðsetning</Text>
            </View>
            <View style={styles.optionContainer}>
              <Option onPress={() => this._switchFilterTown('capitalarea')} text="Höfuðborgarsvæðið" isSelected={filterTowns['capitalarea']} />
              <Option onPress={() => this._switchFilterTown('south')} text="Suðurland" isSelected={filterTowns['south']} />
              <Option onPress={() => this._switchFilterTown('west')} text="Vesturland" isSelected={filterTowns['west']} />
              <Option onPress={() => this._switchFilterTown('north')} text="Norðurland" isSelected={filterTowns['north']} />
              <Option onPress={() => this._switchFilterTown('east')} text="Austurland" isSelected={filterTowns['east']} />
            </View>
          </View>

          <View style={styles.actionContainer}>
            <Button onPress={this._handleFilter} style={styles.finishBtn}><Text style={styles.finishBtnText}>Sía</Text></Button>
          </View>
        </View>
      </View>
    )
  }

  // Method to handle show path to destination Park from User Location.
  onShowRoute = async (park) => {
    
    this.props.navigation.setOptions({ 'tabBarVisible': false });
    this.setState({ filteredParks: [] })
    let { destination } = this.state;
    if (park.GPS && park.GPS.latitude) {
      const destination_gps = {
        latitude: park.GPS.longitude,
        longitude: park.GPS.latitude
      }
      destination.GPS = destination_gps

    this.setState({ destination });
    } else {
      this.setState({ destination: null })
    }

    // Starting Watch User Position
    // Watch User Position
    // let { status } = await Location.requestPermissionsAsync();
    // if (status !== "granted") {
    //   // alert("Permission to access location was denied");
    //   return;
    // }
    this.watchId = await Location.watchPositionAsync({ 
      enableHighAccuracy: true, 
      timeInterval: 10
    },
      newLocation => {
        this.onChangeUserLocation(newLocation)
      })
  }

  // Method to show Filter or Search Result by List / þetta er notað til að sýna Filter eða search niðurstöður í lista
  _renderResultList = () => {
    const { filteredParks } = this.state;
    return (
      <ScrollView style={styles.resultList}>
        {
          filteredParks.length > 0 && filteredParks.map((park, key) =>
            (<Card park={park} key={key} onClick={() => this.onShowRoute(park)} />)
          )
        }
      </ScrollView>
    )
  }
  _renderDirectionSymbol = () => {
    const { maneuver } = this.state;
    switch (maneuver) {
      case 'turn-right':
        return <Feather name="arrow-up-right" size={30} color="white" />;
      case 'turn-left':
        return <Feather name="arrow-up-left" size={30} color="white" />
      default:
        return null;
    }
  }


  renderResultList = () => {
    const { directionTitle } = this.state;
    return (
      <View style={styles.filterArea}>
        {
          directionTitle == '' &&
          <View style={styles.actionArea}>
            <View style={styles.left}>
              <Item style={styles.searchArea}>
                <Input
                  style={styles.searchInputBox}
                  placeholder='Leita af svæði ...'
                  value={this.state.search_key}
                  onChangeText={(txt) => this._changeSearchKey(txt)}
                />
                <Icon active name='search' />
              </Item>

              {
                this._renderResultList()
              }
            </View>
{/* LookHere */}
            <Button style={styles.filterButton} onPress={this.showFilterModal}>
              {/* <Image
                style={styles.filterIcon}
                source={require("../assets/filter.png")}
              /> */}
              <MaterialIcons name="tune" size={24} color="white" style={{paddingLeft: 7}} />
            </Button>
          </View>
        }
        {
          directionTitle != '' &&
          <View style={styles.directonContainer}>
            {
              this._renderDirectionSymbol()
            }
            <HTML source={{ html: directionTitle }} containerStyle={{flex:1, }}baseFontStyle={styles.directionText} />
          </View>
        }
      </View>
    )
  }

  onPressMapView = (event) => {
    this.setState({ filteredParks: [] });
    const { isFilterModalVisible } = this.state;
    if (isFilterModalVisible)
      this.setState({ isFilterModalVisible: false })
  }

  // Method to set distance and duration of the Destination
  setDestination = (result) => {
    let { destination } = this.state;
    destination.distance = result.distance;
    destination.duration = result.duration;
    this.setState({ destination });
  }

  exitRoute = () => {
    this.props.navigation.setOptions({ 'tabBarVisible': true });

    // Set the Camera Default
    this.mapRef.setCamera({
      center: this.state.currentUserPosition,
      pitch: 10, 
      heading: 0,
      altitude: 200, 
      zoom: 15
    })

    // Unsubscribe location watch
    this.watchId.remove();
    this.setState({
      destination: {
        GPS: null,
        distance: null,
        duration: null
      },
      currentUserPosition: null,
      directionTitle: ''
    })
  }

  renderRouteInfo = () => {
    const { destination } = this.state;
    if (destination.distance) {
      return (
        <View style={styles.pathInfoBar}>
          <View style={styles.infoWrapper}>
            <View>
              <Text style={styles.infoText}>{destination.duration.toFixed(0)} Min</Text>
              <Text style={styles.infoText}>{destination.distance.toFixed(0)} Km</Text>
            </View>

            <View>
              <Button style={styles.routeExitBtn} onPress={this.exitRoute}><Text style={styles.exitText}>Exit</Text></Button>
            </View>
          </View>
        </View>)
    } else
      return null
  }

  bs = React.createRef();

  render() {

    const { data, region, isFilterModalVisible } = this.state;
    if(!region)
      return null;

    let origin = {
      latitude: region.latitude,
      longitude: region.longitude,
    }

    const { destination, currentUserPosition } = this.state;

    const openBottomSheet = (value) => {
      this.bs.current.snapTo(0);
      this.setState({ park: value})
    }

    return (
      <View style={styles.container}>
        <ParkPreview ref={this.bs} props={this.state.park} />
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          onPress={(e) => this.onPressMapView(e)}
          provider={PROVIDER_GOOGLE}
          ref={ref => { this.mapRef = ref }}
        >

          {data.map((m) => {
            return (
              
              <Marker
                key={m.ID}
                coordinate={{
                  latitude: parseFloat(m.Long),
                  longitude: parseFloat(m.Lat)
                }}
                onPress={() => openBottomSheet(m)} 
                >
                <Image
                  key={m.ID}
                  style={{ width: 30, height: 30 }}
                  source={require("../assets/dog.png")}
                />
              </Marker>
            );
          })}
          {
            currentUserPosition &&
            <Marker
              coordinate={currentUserPosition}
              description="User Position"
            >
              <Image
                style={{ width: 25, height: 25 }}
                source={require("../assets/google_marker.png")}
              />
            </Marker>
          }


          {
            destination.GPS &&
            <MapViewDirections
              origin={origin}
              destination={destination.GPS}
              apikey={apiKeys.extra.googleMapApiKey}
              strokeWidth={3}
              strokeColor="hotpink"
              mode="DRIVING"
              optimizeWaypoints={true}
              onError={(errorMessage) => {
                console.log('errorMessage: ', errorMessage)
              }}
              onReady={result => {
                this.setDestination(result)
              }
              }
            />
          }
        </MapView>
        {
          isFilterModalVisible ? this.renderFilterModal() : this.renderResultList()
        }
        {
          this.renderRouteInfo()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: 'absolute',
    bottom: 0,
  },
  actionArea: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  filterArea: {
    position: "absolute",
    width: '90%',
    left: '5%',
    top: 50,
  },
  left: {
    flex: 1
  },
  searchArea: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 5
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
    backgroundColor: '#034B42'
  },
  filterIcon: {
    width: 40,
    height: 40
  },
  filterModalArea: {
    position: "absolute",
    width: '90%',
    left: '5%',
    top: 50,
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  closeFilterButtonArea: {

  },
  modalContent: {
    marginTop: 50,
    paddingLeft: 5
  },
  closeFilterButton: {
    position: 'absolute',
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#034B42',
    alignContent: 'center'
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  optionTitleArea: {
    marginBottom: 10,
    marginLeft: 5
  },
  optionTitleText: {
    fontSize: 20
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  finishBtn: {
    borderWidth: 1,
    borderColor: '#02907b',
    borderRadius: 20,
    backgroundColor: '#fff'
  },
  finishBtnText: {
    color: '#02907b',
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
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 20,
  },
  pathInfoBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 100,
    backgroundColor: '#034B42',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  routeExitBtn: {
    backgroundColor: '#C05C5C',
    borderRadius: 20,
  },
  exitText: {
    color: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 18
  },
  infoText: {
    color: 'white',
    fontSize: 18
  },
  directonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: '#034B42',
    borderRadius: 10
  },
  directionText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 18
  }
})