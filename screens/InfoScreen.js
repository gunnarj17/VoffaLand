// import React in our code
import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
// import all the components we are going to use
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";

//import for the animation of Collapse and Expand
import * as Animatable from "react-native-animatable";

//import for the Accordion view
import Accordion from "react-native-collapsible/Accordion";

//Content to show
const CONTENT = [
  {
    title: "Gott að vita...",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    title: "Gott að vita...",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    title: "Gott að vita...",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    title: "Gott að vita...",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    title: "Gott að vita...",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
];

const Info = () => {
  // Default active selector
  const [activeSections, setActiveSections] = useState([]);

  const setSections = (sections) => {
    //setting up a active section state
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };


  //Renders the head of each Accordition when clicked on
  const renderHeader = (section, _, isActive) => {
    //Accordion Header view
    return (
      <Animatable.View
        duration={400}
        
        
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        // transition="backgroundColor"
      >
        <Ionicons
                    name="location-sharp"
                    size={22}
                  />
        <Animatable.Text
          // animation={isActive ? "bounceIn" : undefined}
          // style={{ textAlign: "left", color: "blue" }}
          style={styles.headerText}
        >
          {section.title}
        </Animatable.Text>
      </Animatable.View>
    );
  };

  const renderContent = (section, _, isActive) => {
    //Accordion Content view
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
        // transition="opacity"
      >
        <Animatable.Text
          // animation={isActive ? "bounceIn" : undefined}
          style={{ textAlign: "left", color: "white" }}
        >
          {section.content}
        </Animatable.Text>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Gott að vita</Text>
          <Accordion
            activeSections={activeSections} //for any default active section
            sections={CONTENT} //title and content of accordion
            renderHeader={renderHeader} //Header Component(View) to render
            renderContent={renderContent} //Content Component(View) to render
            duration={400} //Duration for Collapse and expand
            onChange={setSections} //setting the state of active sections
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Info;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // paddingBottom: 60,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 20,
    marginTop: 40,
    fontWeight: "bold",
    color: "#069380",
  },
  header: {
    // textAlign: "left",
    paddingBottom: 10,
  },
  headerText: {
    // textAlign: "left",
    fontSize: 16,
    fontWeight: "bold",
    color: "#069380",
  },
  content: {
    padding: 20,
    backgroundColor: "#fff",
  },
  active: {
    backgroundColor: "#034B42",
  },
  inactive: {
    backgroundColor: "white",
  },
  droidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
});
