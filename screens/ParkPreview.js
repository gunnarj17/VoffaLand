import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

const ParkPreview = (props) => {

    Alert.alert(
    "Alert Title",
    "My Alert Msg",
    [
      {
        text: "Cancel",
        onPress: () => console.log(props),
        style: "cancel"
      },
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]
    );
    
    bs = React.useRef(null);
    fall = new Animated.Value(1);

    renderInner = () => (
        <Text>{props.name}</Text>
    );

    renderHeader = () => (
        <View style={styles.bsHeader}>
            <View style={styles.bsPanelHeader}>
            <View style={styles.bsPanelHandle}></View>
            </View>
        </View>
    );
    return(
        <BottomSheet
          ref={bs}
          snapPoints={[330, 0]}
          renderContent={renderInner}
          renderHeader={renderHeader}
          initialSnap={1}
          callbackNode={fall}
          enabledGestureInteraction={true}
        />
    );
}
export default ParkPreview;