import React, { Component } from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  Button,
  FlatList,
  AsyncStorage,
} from 'react-native';
import Expo, { Constants } from 'expo';

import styles from '../components/styles';

import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';



export default class StartScreen extends Component {

constructor(props){
    super(props);
    this.state = {

        Name: null,
	    LastName: null,
	    EmpName: null,
		Email: null,
    }

}

async componentDidMount () {

      const Name = await AsyncStorage.getItem('Name');
      this.setState({Name: Name});

	  const LastName = await AsyncStorage.getItem('LastName');

	  this.setState({LastName:	LastName});
	  console.log(this.state);

	  const EmpName = await AsyncStorage.getItem('EmpName');
	  this.setState({EmpName: Name});

	  const Email = await AsyncStorage.getItem('Email');
	  this.setState({EmpName: Email});

}


 render() {


	
	return (

	<View style={styles.container}>
		 <View style={styles.contentContainer}>
			<View style={styles.buttonContainer}>
		      <Text>
               Job {this.state.Name} {this.state.LastName}
	           Employee {this.state.EmpName} {this.state.Email}
              </Text>
         </View>
		</View>
	</View>
    );
 }
}