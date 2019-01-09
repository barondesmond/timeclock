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
  Navigator,
  Geolocation,
  TouchableHighlight,
  Dimensions,  
  Picker,
} from 'react-native';
import Expo, { Constants } from 'expo';

import styles from '../components/styles';

import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';


export default class StartScreen extends Component {

constructor(props){
    super(props);
    this.state = {

        Name: null,
	    LocName: null,
	    JobNotes: null,		 
	    EmpName: null,
		Email: null,
        EmpNo: null,
	    Bio: null,
		latitude: null,
        longitude: null,
        error: null,
        checkinStatus: 'Start',
        csBack: 'green',
        active: true,
		event: null,
		eventstatus: true,
    }

}


async componentDidMount () {

      const Name = await AsyncStorage.getItem('Name');
      this.setState({Name: Name});

	  const LocName = await AsyncStorage.getItem('LocName');
	  this.setState({LocName: LocName});

	  const JobNotes = await AsyncStorage.getItem('JobNotes');
	  this.setState({JobNotes: JobNotes});

	  const EmpName = await AsyncStorage.getItem('EmpName');
	  this.setState({EmpName: EmpName});

	  const Email = await AsyncStorage.getItem('Email');
	  this.setState({Email: Email});

	  const EmpNo = await AsyncStorage.getItem('EmpNo');
	  this.setState({EmpNo: EmpNo});

	  const Bio = await AsyncStorage.getItem('Bio');
	  this.setState({Bio: Bio});

     this.watchId = navigator.geolocation.watchPosition(

      (position) => {

        this.setState({

          latitude: position.coords.latitude,

          longitude: position.coords.longitude,

          error: null,

        });

      },

      (error) => this.setState({ error: error.message }),

      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },

    );

      console.log(this.state);
  
}

 componentWillUnmount() {

    navigator.geolocation.clearWatch(this.watchId);

  }

 async checkStatus() {
	
	if (this.state.checkinStatus == 'Start') {
		this.setState({checkinStatus: 'Stop', active: !this.state.active});
	}
	else {
		this.setState({checkinStatus: 'Start', active: !this.state.active});
	}
	console.log(this.state);
}

  updateEvent = (event) => {
	  if (event != '')
	  {
	      this.setState({ event: event, eventstatus: !this.state.eventstatus })
	  }
   }



 render() {


	
	return (

	<View style={styles.container}>
    <View style={styles.welcomeContainer}>
			<View style={styles.buttonContainer}>
		      <Text style={styles.getStartedText}>
               Job {this.state.LocName}
	          </Text>

         </View>
			<View style={styles.buttonContainer}>
		      <Text style={styles.getStartedText}>
	          Notes {this.state.JobNotes}
	          </Text>

         </View>

			<TouchableHighlight style={this.state.active? circ.circleContainerStart: circ.circleContainerStop} onPress = { () =>  this.checkStatus() } >
	     <Text> 
	 {this.state.checkinStatus}
	         </Text>
            </TouchableHighlight>
	
    
		<View style={styles.buttonContainer}>
            <View>
	        {
            this.state.eventstatus ? <Picker selectedValue = {this.state.event} onValueChange = {this.updateEvent}>
			   <Picker.Item label = "Select Event" value = "" />
               <Picker.Item label = "Travel" value = "travel" />
               <Picker.Item label = "Check In" value = "checkin" />
               <Picker.Item label = "Check Out" value = "checkout" />
            </Picker> : <Text style={styles.getStartedText}>{this.state.event}</Text>
            }
   
         </View>

         </View>
			<View style={styles.buttonContainer}>
		      <Text style={styles.getStartedText}>
               Status {this.state.checkinStatus} {this.state.event} and Job# {this.state.Name}
	          </Text>

         </View>
			<View style={styles.buttonContainer}>
		     <Text style={styles.getStartedText}>GPS </Text>
			 <Text style={styles.getStartedText}> Latitude : {this.state.latitude} </Text>
		     <Text style={styles.getStartedText}> Longitude: {this.state.longitude} </Text>

         </View>
			<View style={styles.buttonContainer}>
		      <Text style={styles.getStartedText}>
               Done
	          </Text>

         </View>
	</View>
    </View>
    );
 }
}

circ = StyleSheet.create({
	
	circleContainerStart: {
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
	justifyContent: 'center',
	backgroundColor: 'green' ,
    alignItems: 'center',
	},
	circleContainerStop: {
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
	justifyContent: 'center',
	backgroundColor: 'red' ,
    alignItems: 'center',
	},

	});