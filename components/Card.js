import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Button, Label } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";

const Card = (props, { navigation }) => {
  let isFree = props.park.Free ? "lausagöngusvæði" : "Gerði";
  return (
    <View style={Styles.container}>
      <View style={Styles.left}>
        <TouchableOpacity>
          <View style={{ marginBottom: 10 }}>
            <Text style={Styles.text}>{props.park && props.park.Name}</Text>
          </View>
          <View>
            <Text style={Styles.text}>{props.distance + " km"} </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={Styles.right}>
        <View>
          <TouchableOpacity style={Styles.iconButton} onPress={props.onClick}>
            <FontAwesome5 name="directions" size={26} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: "#dcdcdc",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    backgroundColor: "#fff",
  },
  left: {
    flex: 1,
  },
  right: {},
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    backgroundColor: "#034B42",
    borderRadius: 50,
    alignSelf: "flex-end",
  },
  text: {
    fontSize: 20,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  filterIcon: {
    width: 40,
    height: 40,
  },
});

export default Card;
