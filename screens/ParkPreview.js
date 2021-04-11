// park preview
import * as React from "react";
import { StyleSheet, Text, View, Button} from "react-native";
import { Icon,} from "native-base";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";

const ParkPreview = React.forwardRef(({ props }, ref) => {
  console.log(props)
  const renderInner = () => (
    <View style={styles.panel}>
      <View style={styles.panelTop}>
        <Text style={styles.panelTitle}>{props && props.Name ? props.Name : "Vantar nafn"}</Text>
      </View>
      <View style={styles.panelBottom}>
        <View style={styles.panelLeft}>
          <View style={styles.iconView}>
            <Icon style={styles.Icons} name='star'/><Icon style={styles.Icons} name='star'/><Icon style={styles.Icons} name='star'/>
          </View>
          <Text style={styles.leftText}> </Text>
        </View>
        <View style={styles.panelRight}>
          <Text style={styles.rightText}>Right</Text>
        </View>
      </View>
    </View>
  );
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle}></View>
      </View>
    </View>
  );
  const fall = new Animated.Value(1);

  return (
    <BottomSheet
      ref={ref}
      snapPoints={[350, 0]}
      renderContent={renderInner}
      renderHeader={renderHeader}
      initialSnap={1}
      callbackNode={fall}
      enabledGestureInteraction={true}
    />
  );
});
export default ParkPreview;

const styles = StyleSheet.create({
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    backgroundColor: "white",
  },
  panelTop: {
  },
  panelTitle: {
    fontSize: 24,
  },
  panelBottom: {
    flexDirection:'row',
    justifyContent:'space-between',
  },
  panelLeft: {
    alignSelf: 'flex-start',
    padding: 10
  },
  iconView: {
    flexDirection: 'row'
  },
  Icons: {
    color: '#C4C4C4'
  },
  leftText: {
    fontSize: 18
  },
  rightText: {
    fontSize: 18,
  },
  panelRight: {
    alignSelf: 'flex-end',
    padding: 10
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
});