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



export default class JobsScreen extends Component {

constructor(props){
    super(props);
}

 state = {
    compatible: false,
    isLoading : true,
    dataSource : '',
    Name : '',
    LastName : '',

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

console.log(this.props);
}

 render() {



	
	return (
		<View style={styles.container}>
		 <View style={styles.contentContainer}>
			<View style={styles.buttonContainer}>
			    <Button title="Select Job"  onPress={this.buttonClickListener} />

</View>
		</View>
       </View>
    );
 }
}