import React, { Component, useEffect } from "react";
import MapView, { Polyline, Marker } from "react-native-maps";
import { StyleSheet, Text, LogBox, View, Dimensions, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import * as Location from 'expo-location';
import * as firebase from 'firebase';
import 'firebase/firestore';
import {
  Container,
  Item,
  Icon,
  Button,
  Input,
  Form
} from 'native-base';
import Option from '../components/Option'; // buttons for filter
import Card from '../components/Card'; // listing options from search and filter //  mögulega breytta þessu útliti í popupið hjá mariu?

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
      parkList: []
    }
  }


  _getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();

    if (status !== "granted") {
      // alert("Permission to access location was denied");
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
    this.setState({ isLoading: true });
    await this._getLocation();

    const documentSnapshot = await firebase.firestore().collection('Parks').get();

    let transformArray = [];
    let parkList = []
    documentSnapshot.forEach(async (res) => {
      const { GPS } = res.data();
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

  renderFilterModal = () => {
    const { filterOption, filterTowns } = this.state;
    return (
      <View style={styles.filterModalArea}>
        <View style={styles.closeFilterButtonArea}>
          <Button style={styles.closeFilterButton} onPress={this.hideFilterModal}>
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

  // Method to show Filter or Search Result by List / þetta er notað til að sýna Filter eða search niðurstöður í lista
  _renderResultList = () => {
    const { filteredParks } = this.state;
    console.log('filteredParks: ', filteredParks);
    return (
      <ScrollView style={styles.resultList}>
        {
          filteredParks.length > 0 && filteredParks.map((park, key) =>
            (<Card park={park} key={key} />)
          )
        }
      </ScrollView>
    )
  }

  renderResultList = () => {
    return (
      <View style={styles.filterArea}>
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

          <Button style={styles.filterButton} onPress={this.showFilterModal}>
            <Image
              style={styles.filterIcon}
              source={require("../assets/filter.png")}
            />
          </Button>
        </View>
      </View>
    )
  }

  onPressMapView = (event) => {
    this.setState({ filteredParks: [] });
    const { isFilterModalVisible } = this.state;
    if (isFilterModalVisible)
      this.setState({ isFilterModalVisible: false })
  }

  render() {

    const { data, region, isFilterModalVisible } = this.state;

    let initialRegion = {
      latitude: 64.07287152431486,
      longitude: -21.948613737592083,
      latitudeDelta: 0.0999,
      longitudeDelta: 0.0999
    }


    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          onPress={(e) => this.onPressMapView(e)}
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
                description="Description" // þarf að breyta þessu í styttri lýsingu á svæði eða taka út.
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
        {
          isFilterModalVisible ? this.renderFilterModal() : this.renderResultList()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 5
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
    borderRadius: 20
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
  }
})