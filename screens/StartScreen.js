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
  Picker,
} from 'react-native';
import Expo, { Constants } from 'expo';

import styles from '../components/styles';

import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL} from '../constants/common';



export default class StartScreen extends Component {

constructor(props){
    super(props);
}

 state = {
    compatible: false,
    isLoading : true,
    dataSource : '',
    Job : 'Job',

  };
 componentDidMount(){
    return fetch(URL + 'jobs_json.php')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.jobs,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }



buttonClickListener = () =>{

console.log(this.state);

}

 render() {



	
	return (
		<View style={styles.container}>
		  <Text>
          Job# {this.props.navigation.state.params.Name} Job {this.props.navigation.state.params.LastName}
        </Text>
 
	</View>
    );
 }
}