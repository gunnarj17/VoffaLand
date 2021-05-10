import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";
import Modal from "react-native-modal";
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const { height } = Dimensions.get("window");

export default function EventScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  const [changeEvent, setChangeEvent] = useState([]);

  const [filterEvents, setFilterEvents] = useState([]);

  const [eventModal, setEventsModal] = useState([]);

  const [filterOptions, setFilterOptions] = useState(false);

  const [filterMultipleEvents, setFilterMultipleEvents] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);

  const [isFetching, setIsFetching] = useState(false);

  const [searching, setSearching] = useState(false);

  const getData = useCallback(async () => {
    try {
      let transformArray = [];
      let transformEventArray = [];

      const eventSnapshot = await firebase
        .firestore()
        .collection("Events")
        .get();

      eventSnapshot.forEach((res) => {
        const { name, photo } = res.data();

        transformEventArray.push({ name, photo });
      });

      setEventsModal(transformEventArray);

      const snapshop = await firebase
        .firestore()
        .collection("UserEvents")
        .get();

      snapshop.forEach((res) => {
        const { park, event, date, photo, description } = res.data();

        transformArray.push({
          id: res.id,
          park,
          event,
          date,
          photo,
          description,
        });
      });

      setEvents(transformArray);
    } catch (err) {
      Alert.alert(err.message);
    }
  }, [setEvents]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsFetching(true);
      getData().then(() => {
        setIsFetching(false);
      });
    });

    return () => {
      unsubscribe;
    };
  }, [getData, setIsFetching]);

  if (isFetching) {
    return (
      <View style={styles.indicator}>
        <StatusBar
          style="dark"
          backgroundColor={height > 850 ? "#D7D7D7" : "#FFFFFF"}
        />
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  const eventSearch = async (e) => {
    setSearch(e);
    setSearching(true);

    if (search.length != 0) {
      firebase
        .firestore()
        .collection("UserEvents")
        .orderBy("event")
        .startAt(search)
        .endAt(search + "\uf8ff")
        .onSnapshot(
          (querySnapshot) => {
            let transformArray = [];

            querySnapshot.forEach((res) => {
              const { park, event, date, photo, description } = res.data();

              transformArray.push({
                id: res.id,
                park,
                event,
                date,
                photo,
                description,
              });
            });

            setFilterEvents(transformArray);

            setSearching(false);
          },
          (err) => {
            setSearching(false);
            console.log(`Encountered error: ${err}`);
          }
        );
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const selectEvent = (item) => {
    setChangeEvent([...changeEvent, item]);
  };

  const unselectEvent = (item) => {
    const filterArray = changeEvent.filter((e) => e.id != item.id);

    setChangeEvent(filterArray);
  };

  const onChangeArray = async () => {
    setTimeout(function () {}, 3000);

    if (changeEvent.length != 0) {
      setSearching(true);

      changeEvent.forEach((item) => {
        firebase
          .firestore()
          .collection("UserEvents")
          .orderBy("event")
          .startAt(item.name)
          .endAt(item.name + "\uf8ff")
          .onSnapshot(
            (querySnapshot) => {
              let transformArray = [];

              querySnapshot.forEach((res) => {
                const { park, event, date, photo, description } = res.data();

                if (
                  !filterMultipleEvents.find((e) => e.id === res.id) &&
                  !filterMultipleEvents.find((e) => e.event === event)
                ) {
                  transformArray.push({
                    id: res.id,
                    park,
                    event,
                    date,
                    photo,
                    description,
                  });
                }
              });

              setFilterMultipleEvents((filterMultipleEvents) => [
                ...filterMultipleEvents,
                ...transformArray,
              ]);

              setFilterOptions(true);
              setSearching(false);
            },
            (err) => {
              setSearching(false);
              console.log(`Encountered error: ${err}`);
            }
          );
      });
    }
  };

  const clearFilters = () => {
    setSearching(true);
    setFilterMultipleEvents([]);
    setFilterOptions(false);
    setChangeEvent([]);
    setSearching(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        style="dark"
        backgroundColor={height > 850 ? "#80A5A0" : "#80A5A0"}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput
            autoCorrect={false}
            placeholder="Leita af viðburði"
            placeholderTextColor="#81A5A0"
            onChangeText={(e) => eventSearch(e)}
            value={search}
            style={styles.input}
          />
          <Feather
            name="search"
            size={20}
            color="black"
            style={styles.search}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.headerIcon1}
          >
            <FontAwesome5 name="sliders-h" size={hp(2.8)} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddEventScreen")}
            style={styles.headerIcon2}
          >
            <Ionicons name="ios-add" size={hp(3.4)} color="white" />
          </TouchableOpacity>
        </View>
        {searching ? (
          <View style={styles.indicator}>
            <ActivityIndicator size="large" color="green" />
          </View>
        ) : search.length != 0 && filterEvents.length === 0 ? (
          <View style={styles.indicator}>
            <Text style={{ color: "black" }}>No Events Found!</Text>
          </View>
        ) : search.length != 0 ? (
          <FlatList
            keyExtractor={(item) => item.id}
            data={filterEvents}
            style={styles.flatList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ViewEventScreen", {
                      id: item.id,
                      photo: item.photo,
                      event: item.event,
                      park: item.park,
                      date: item.date,
                      description: item.description,
                      userId: item.user,
                      users: item.users,
                    })
                  }
                  style={styles.cardContainer}
                >
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.photo }} style={styles.image} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text numberOfLines={1} style={styles.text1}>
                      {item.event}
                    </Text>
                    <Text style={styles.text2}>
                      {item.date.toDate().getDate()}.
                      {item.date.toDate().getMonth() + 1}.
                      {item.date.toDate().getFullYear().toString().substr(-2)}{" "}
                      kl.
                      {item.date.toDate().toLocaleTimeString().substring(0, 5)}
                    </Text>
                  </View>
                  <Text style={styles.text3}>{item.park}</Text>
                </TouchableOpacity>
              );
            }}
          />
        ) : filterOptions && filterMultipleEvents.length === 0 ? (
          <>
            <TouchableOpacity
              onPress={clearFilters}
              style={{
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                borderRadius: 15,
                alignSelf: "flex-start",
                elevation: 5,
                backgroundColor: "white",
                marginLeft: wp(5),
                marginTop: hp(3),
                marginBottom: hp(3),
              }}
            >
              <Text
                style={{ fontSize: hp(2), padding: 10, paddingHorizontal: 20 }}
              >
                Clear Filters
              </Text>
            </TouchableOpacity>
            <Text style={{ textAlign: "center", marginTop: hp(3) }}>
              No Events Found
            </Text>
          </>
        ) : filterMultipleEvents.length != 0 ? (
          <FlatList
            keyExtractor={(item) => item.id}
            data={filterMultipleEvents}
            style={styles.flatList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => {
              return (
                <TouchableOpacity
                  onPress={clearFilters}
                  style={{
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                    borderRadius: 15,
                    alignSelf: "flex-start",
                    elevation: 5,
                    backgroundColor: "white",
                    marginLeft: wp(5),
                    marginTop: hp(3),
                    marginBottom: hp(3),
                  }}
                >
                  <Text
                    style={{
                      fontSize: hp(2),
                      padding: 10,
                      paddingHorizontal: 20,
                    }}
                  >
                    Clear Filters
                  </Text>
                </TouchableOpacity>
              );
            }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AddEventScreen", {
                      id: item.id,
                      photo: item.photo,
                      event: item.event,
                      park: item.park,
                      date: item.date,
                      description: item.description,
                      userId: item.user,
                      users: item.users,
                    })
                  }
                  style={styles.cardContainer}
                >
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.photo }} style={styles.image} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text numberOfLines={1} style={styles.text1}>
                      {item.event}
                    </Text>
                    {item.hasOwnProperty("date") && (
                      <Text style={styles.text2}>
                        {item.date.toDate().getDate()}.
                        {item.date.toDate().getMonth() + 1}.
                        {item.date.toDate().getFullYear().toString().substr(-2)}{" "}
                        kl.
                        {item.date
                          .toDate()
                          .toLocaleTimeString()
                          .substring(0, 5)}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.text3}>{item.park}</Text>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <FlatList
            keyExtractor={(item) => item.id}
            data={events}
            style={styles.flatList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ViewEventScreen", {
                      id: item.id,
                      photo: item.photo,
                      event: item.event,
                      park: item.park,
                      date: item.date,
                      description: item.description,
                      userId: item.user,
                      users: item.users,
                    })
                  }
                  style={styles.cardContainer}
                >
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.photo }} style={styles.image} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text numberOfLines={1} style={styles.text1}>
                      {item.event}
                    </Text>
                    <Text style={styles.text2}>
                      {item.date.toDate().getDate()}.
                      {item.date.toDate().getMonth() + 1}.
                      {item.date.toDate().getFullYear().toString().substr(-2)}{" "}
                      kl.
                      {item.date.toDate().toLocaleTimeString().substring(0, 5)}
                    </Text>
                  </View>
                  <Text style={styles.text3}>{item.park}</Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
        <Modal isVisible={isModalVisible} animationOutTiming={0}>
          {Platform.OS === "android" ? (
            <StatusBar backgroundColor="rgba(0,0,0,0.5)" />
          ) : null}
          <View style={styles.modalContainer}>
            <FlatList
              keyExtractor={(item) => item.name}
              data={eventModal}
              style={styles.flatList}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => {
                return (
                  <>
                    <TouchableOpacity
                      onPress={toggleModal}
                      style={styles.closeIcon}
                    >
                      <FontAwesome5
                        name="sliders-h"
                        size={hp(2.8)}
                        color="white"
                      />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Tegund Viðburðar</Text>
                  </>
                );
              }}
              ListFooterComponent={() => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(!isModalVisible);
                      onChangeArray();
                    }}
                    activeOpacity={0.7}
                    style={styles.modalButtonContainer}
                  >
                    <Text style={styles.modalButton}>Sia</Text>
                  </TouchableOpacity>
                );
              }}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      changeEvent.find((e) => e.name === item.name)
                        ? unselectEvent(item)
                        : selectEvent(item);
                    }}
                    style={
                      changeEvent.find((e) => e.name === item.name)
                        ? {
                            ...styles.modalTextContainer,
                            backgroundColor: "#069380",
                          }
                        : {
                            ...styles.modalTextContainer,
                            backgroundColor: "#BDBDBD",
                          }
                    }
                  >
                    <Text style={styles.modalText}>{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#80A5A0",
    marginTop: hp(4.4),
  },
  input: {
    width: wp(60),
    fontSize: hp(2.3),
    backgroundColor: "white",
    marginTop: hp(3),
    padding: 8,
    borderRadius: 6,
    paddingHorizontal: 15,
    marginLeft: wp(6),
    marginBottom: hp(4),
  },
  search: {
    position: "absolute",
    marginTop: hp(4.5),
    marginLeft: wp(56),
    zIndex: 1,
  },
  headerIcon1: {
    marginTop: hp(3.4),
    marginLeft: wp(4),
    backgroundColor: "#034B42",
    height: hp(5.6),
    borderRadius: 50,
    paddingHorizontal: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon2: {
    marginTop: hp(3.4),
    marginLeft: wp(3),
    backgroundColor: "#034B42",
    height: hp(5.5),
    borderRadius: 50,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  flatList: {
    flex: 1,
    marginBottom: hp(2),
  },
  cardContainer: {
    marginBottom: hp(2),
  },
  imageContainer: {
    width: wp(100),
    height: hp(25),
  },
  image: {
    flex: 1,
    width: null,
    height: null,
  },
  textContainer: {
    flexDirection: "row",
    marginTop: hp(2),
  },
  text1: {
    fontSize: hp(2.5),
    width: wp(50),
    fontWeight: "bold",
    paddingLeft: wp(5),
  },
  text2: {
    fontSize: hp(2.2),
    paddingTop: hp(0.1),
  },
  text3: {
    fontSize: hp(2.5),
    width: wp(50),
    marginTop: hp(0.5),
    paddingLeft: wp(5),
  },
  modalContainer: {
    height: hp(55),
    width: wp(95),
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 15,
  },
  closeIcon: {
    marginTop: hp(2.5),
    marginRight: wp(4),
    backgroundColor: "#034B42",
    height: hp(5.6),
    borderRadius: 50,
    paddingHorizontal: 11,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: hp(3),
    marginLeft: wp(4),
    marginBottom: hp(2),
    fontWeight: "bold",
  },
  modalTextContainer: {
    marginLeft: wp(4),
    marginTop: hp(2),
    borderRadius: 20,
    backgroundColor: "#BDBDBD",
  },
  modalText: {
    fontSize: hp(2.3),
    color: "white",
    padding: 8,
    paddingHorizontal: 18,
  },
  modalButtonContainer: {
    alignSelf: "center",
    marginTop: hp(7),
    borderColor: "#069380",
    borderWidth: 1,
    borderRadius: 20,
  },
  modalButton: {
    fontSize: hp(3),
    paddingHorizontal: 40,
    padding: 5,
    color: "#069380",
  },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
