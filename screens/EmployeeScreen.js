import React, { Component } from 'react';

import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  Button,
  AsyncStorage,
  Navigator,
  Geolocation,
  TouchableHighlight,
  Dimensions,  
  Picker,
  Modal,
  TextInput,
} from 'react-native';
import Expo, { Constants, Location, Permissions } from 'expo';

import styles from '../components/styles';

import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';




export default class DispatchScreen extends Component {

	  watchID: ?number = null;


constructor(props){
    super(props);
    this.state = {

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
		event: 'Select Event',
		eventstatus: true,
		dispatchstatus: true,
        pickers: null,
        auth: null,
		timer: null,
        violation: null,
	    image: null,
		lastposition: null,
		locationstatus: null,
		isEventVisible: false,
		isNotesVisible: false,
		isLoading: true,
		addEmployeeNote: '',
        gps: __DEV__,
    }

}



renderGPS = () => {

if (!this.state.gps)
{
	return false;
}
return (
			<View style={styles.buttonContainer}>
			     <Text style={styles.getStartedText}>GPS </Text>
			 <Text style={styles.getStartedText}> Latitude : {this.state.latitude} </Text>
		     <Text style={styles.getStartedText}> Longitude: {this.state.longitude} </Text>
	        </View>
 );
};

async authEmpInstApi() {

 
	await fetch(URL + `authempinst_json.php?EmpNo=${this.state.EmpNo}&installationId=${Constants.installationId}&dev=${__DEV__}`)
      .then((response2) => response2.json())
      .then((responseJson2) => {

        this.setState({
          isLoading: false,
          auth: responseJson2,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });

      console.log(this.state.auth);
	  if (this.state.auth.authorized == 0)
	  {
		  this.props.navigation.navigate('Alternative');
		  console.log('not authorized');
	  }
	  if (this.state.auth.EmpActive == 1)
	  {
		  console.log('logged in');
		  if (this.state.auth.Screen != 'Employee')
		  {
			  this.props.navigation.navigate(this.state.auth.Screen);
		  }
		  this.setState({event : this.state.auth.event, eventstatus: false,  checkinStatus: 'Stop', active: false}); 

	  }
	  
	  
     return this.state.auth;	
}

async authEventLogApi() {

	
	if (__DEV__ && this.state.latitude == null)
	{
		this.setState({latitude: '33.3333', longitude: '-88.9888'});
	}
	Screen = await AsyncStorage.getItem('Screen');
	let authurl = URL + `authempinst_json.php?EmpNo=${this.state.EmpNo}&installationId=${Constants.installationId}&event=${this.state.event}&checkinStatus=${this.state.checkinStatus}&addEmployeeNote=${this.state.addEmployeeNote}&Bio=${this.state.Bio}&violation=${this.state.violation}&image=${this.state.image}&latitude=${this.state.latitude}&longitude=${this.state.longitude}&Screen=${Screen}&dev=${__DEV__}`;
	  await fetch(authurl)
      .then((response2) => response2.json())
      .then((responseJson2) => {

        this.setState({
          isLoading: false,
          auth: responseJson2,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });

      console.log(this.state.auth);
	  if (this.state.auth.authorized == 0)
	  {
		  this.props.navigation.navigate('Alternative');
		  console.log('not authorized');
		  return false;
	  }
	  if (this.state.auth.EmpActive == 1)
	  {
		  
		  console.log('logged in');
	  }
	  else
	 {
		  console.log('logged out');
     }
	  
     return this.state.auth;	
}
timeHome = () => {

	this.props.navigation.navigate('Home');
	
}


_getLocationAsync = async () => {

	let { status } = await Permissions.askAsync(Permissions.LOCATION);
	if (status !== 'granted') 
	{
	   this.setState({locationstatus: status});
	}

}


async componentDidMount () {

	  this._getLocationAsync();
	  if (!this.state.locationstatus)
	  {
		 let location = await Location.getCurrentPositionAsync({});
		 console.log(location);
		 this.setState({latitude: location.coords.latitude, longitude: location.coords.longitude});
	  }
	 
	  setTimeout(this.timeHome, 100000);
	
	  const EmpName = await AsyncStorage.getItem('EmpName');
	  this.setState({EmpName: EmpName});

	  const Email = await AsyncStorage.getItem('Email');
	  this.setState({Email: Email});

	  const EmpNo = await AsyncStorage.getItem('EmpNo');
	  this.setState({EmpNo: EmpNo});

	  const Bio = await AsyncStorage.getItem('Bio');
	  this.setState({Bio: Bio});
	  const violation = await AsyncStorage.getItem('violation');
	  const image = await AsyncStorage.getItem('image');
	  this.setState({violation: violation, image: image});
	
	  await this.authEmpInstApi();

  
}

error(err) {
  Alert.alert('ERROR(' + err.code + '): ' + err.message);
}

 componentWillUnmount() {

    navigator.geolocation.clearWatch(this.watchId);
    clearInterval();
  }

 async checkStatus() {

	if (this.state.checkinStatus == 'Start' && !this.state.eventstatus && this.state.addEmployeeNote == '')
	{
		Alert.alert('Employee Note Required');
		return false;
	}
	if (this.state.checkinStatus == 'Start' && this.state.event=='Select Event')
	{
		Alert.alert('Employee Event Required');
		return false;
	}
	
	if (this.state.checkinStatus == 'Start'  && !this.state.eventstatus && this.state.addEmployeeNote != '') {
		await this.authEventLogApi();
		if (this.state.auth.EmpActive == '1')
		{
			this.setState({checkinStatus: 'Stop', active: !this.state.active, addEmployeeNote: ''});
			return false;
		}
	}
	else if (this.state.checkinStatus == 'Stop'  && !this.state.eventstatus) {
			await this.authEventLogApi();
			if (this.state.auth.EmpActive != '1')
			{
				this.setState({checkinStatus: 'Start', active: !this.state.active});
				return false;
			}
	
	}


	//console.log(this.state);

}

  updateEvent = (event) => {
		console.log(event);
	   this.setState({ event: event, eventstatus: !this.state.eventstatus, isEventVisible: false })
       //this.setState({isEventVisible: false});
   }
   updateEventStatus = () => {
	  
	  this.setState({eventstatus: !this.state.eventstatus, isEventVisible: true})
   }

 

resetEventStatus = () => {
	 if (this.state.active)
	 {
		 this.updateEventStatus();
	 }
 }
 
 
 
 addNote = () => {

if (this.state.checkinStatus == 'Stop')
{
	return false;
}
return(
	<View style={styles.buttonContainer}>
			<Button key="Open" title="Add Note" onPress={() => this.setState({isNotesVisible: true})} value="Open" />
		 </View>
);
}

renderEmployeeNotes = () => {

	if (this.state.isLoading)
	{
		return false;
	}
	return(<View>
            <Modal animationType = {"slide"} transparent = {false}
                   visible = {this.state.isNotesVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
   
  		        <ScrollView style={styles.buttonContainer}>
			      	    <TextInput placeholder="Note" multiline={true}     numberOfLines={4}
        style={styles.noteContainer} value={this.state.addEmployeeNote} 
                  onChangeText={data => this.setState({ addEmployeeNote: data })}
      />
		   <Button key="Post" title="Post Note"

          onPress={() => this.setState({isNotesVisible: false})}

          style={styles.buttonContainer} value="Post" />

		        </ScrollView>
               </Modal>
				</View>
   );

}
			

 render() {


	
	return (

	<View style={styles.container}>
    <View style={styles.welcomeContainer}>
	<View style={styles.buttonContainer}> 
		<Text style={styles.getStartedText}> Primelogic Employee TimeClock </Text>
	 </View>
			<TouchableHighlight style={this.state.active? styles.circleContainerStart: styles.circleContainerStop} onPress = { () =>  this.checkStatus() } >
	     <Text style={styles.getCircleText}> 
	 {this.state.checkinStatus}
	         </Text>
            </TouchableHighlight>
	

   	 <View style={styles.buttonContainer}>
      <Modal animationType = {"slide"} transparent = {true}
                   visible = {this.state.isEventVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
  		        <ScrollView style={styles.buttonContainer}>
	           <Button title="Traveling" onPress={()=>this.updateEvent('Traveling')} />
		           <Button title="Working" onPress={()=>this.updateEvent('Working')} />
		        </ScrollView>
      </Modal>
		{
    	    this.state.eventstatus? <Button title={this.state.event} onPress = {() => this.setState({isEventVisible: true})} /> : <Button style={styles.buttonContainer} title={this.state.event}  onPress={this.resetEventStatus} /> 
         }
		</View>

      	   
			<View style={styles.buttonContainer}>
		      <Text style={styles.getStartedText}>
               Status {this.state.checkinStatus} {this.state.event}
	          </Text>

            </View>
	 {this.addNote()}
	 {this.renderEmployeeNotes()}

			{this.renderGPS()}     

	
	</View>
    </View>
    );
 }
}

