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
  AsyncStorage,
  Navigation,

} from 'react-native';
import Expo, { Constants } from 'expo';

import styles from '../components/styles';

import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';



export default class JobsScreen extends React.Component {

   constructor(props) {

    super(props);

    this.state = {

        Name: null,
        LastName: null,
        dataSource : '',

    }

  }

 async componentDidMount(){
    

      const Name = await AsyncStorage.getItem('Name');
      if (Name != null)
      {
		  this.props.navigation.navigate('Start');
      }
	  else
	 {
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
  }


 


  async saveKey(Name, LastName) {

    try {

      await AsyncStorage.setItem('Name', Name);
      await AsyncStorage.setItem('LastName', LastName);

	} catch (error) {


      console.log("Error saving data" + error);

    }
	console.log(Name);
	console.log(LastName);
	this.props.navigation.navigate('Start');


  }



  


 render() {



	
	return (
		<View style={styles.container}>
		 <View style={styles.contentContainer}>
			<View style={styles.buttonContainer}>
			    <Text>Select Job</Text>
            </View>
		</View>

		 <View style={styles.contentContainer}>
			<View style={styles.buttonContainer}>
			<FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Button title={item.LastName} onPress={(Name, LastName) => this.saveKey(item.Name, item.LastName)} /> }
          keyExtractor={({id}, index) => id}
        />
            </View>
		</View>

       </View>
    );
 }
}