import React from 'react';
import { 
	StyleSheet,
	View, 
	Text 
} from 'react-native';
import {
	Button,
	Label
} from 'native-base';

const Option = (props) => {
	const _style = props.isSelected ? Styles.ActiveStyle : Styles.InActiveStyle; 
	const text = props.text ? props.text : ""
	return <Button style={_style} onPress={props.onPress}><Text style={Styles.text}>{text}</Text></Button>
}

const Styles = StyleSheet.create({ 
	InActiveStyle: {
		backgroundColor: '#DCDCDC',
		marginLeft: 5,
		marginRight: 5,
		borderRadius: 20,
		paddingLeft: 10,
		paddingRight: 10,
		marginTop: 4,
		marginBottom: 4
	},
	ActiveStyle: {
		backgroundColor: '#02907b',
		marginLeft: 5,
		marginRight: 5,
		borderRadius: 20,
		paddingLeft: 10,
		paddingRight: 10,
		marginTop: 4,
		marginBottom: 4
	},
	text: {
		color: '#fff',
		fontSize: 17
	}
})

export default Option;