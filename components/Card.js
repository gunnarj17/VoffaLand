import React from 'react';
import { 
	StyleSheet,
	View, 
	Text,
	Image 
} from 'react-native';
import {
	Button,
	Label
} from 'native-base';

const Card = (props) => {
	let isFree = props.park.Free ? 'lausagöngusvæði' : 'Gerði';
	return (
	<View style={Styles.container}>
		<View style={Styles.left}>
			<View style={{marginBottom: 10}}><Text style={Styles.text}>{isFree}</Text></View>
			<View><Text style={Styles.text}>Lengd * {props.park && props.park.Name}</Text></View>
		</View>
		<View style={Styles.right}>
                <Button style={Styles.filterButton} onPress={props.onClick}>
                  <Image
                      style={Styles.filterIcon}
                      source={require("../assets/direct.png")}
                  />
                </Button>
		</View>
	</View>
	)
}

const Styles = StyleSheet.create({
	container: {
		padding: 10,
		paddingLeft: 20,
		borderBottomWidth: 1,
		borderColor: '#dcdcdc',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 100,
		backgroundColor: '#fff'
	},
	left: {
		flex: 1
	},
	right: {

	},
	text: {
		fontSize: 20
	},
	filterButton: {
	    width: 40,
	    height: 40,
	    borderRadius: 20
	},
	filterIcon: {
	    width: 40,
	    height: 40
	},
})

export default Card;