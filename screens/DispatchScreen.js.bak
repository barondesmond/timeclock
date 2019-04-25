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
  TextInput
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
        dispatchs: null,
        Dispatch: '',
		DispatchName: 'Select Dispatch',
		dispatchstatus: true,
        pickers: null,
        auth: null,
		timer: null,
        violation: null,
	    image: null,
		lastposition: null,
		locationstatus: null,
        dispatchlatitude: null,
		dispatchlongitude: null,
		dispatchdistance: null,
		Counter: null,
		JobID: null,
        isDispatchVisible: false,
		isEventVisible: false,
		isNotesVisible: false,
		override: false,
        Add1: '',
		Add2: '',
		City: '',
		State: '',
		Zip: '',
		Phone1: '',
		addDispatchNote: '',
		addDispatchPicture: false,
		isVisibleDispatchNote: false,
		gps: __DEV__,
    }

}

async fetchDispatchsFromApi() {

 
	await fetch(URL + `dispatchs_json.php?latitude=${this.state.latitude}&longitude=${this.state.longitude}&ServiceMan=${this.state.EmpNo}&EmpNo=${this.state.EmpNo}&installationId=${Constants.installationId}&dev=${__DEV__}`)
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dispatchs: responseJson.dispatchs,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
	  let pickers = [];
	 if (this.state.dispatchs == null)
	 {
		 const rm = await AsyncStorage.removeItem('Screen');
		 this.props.navigation.navigate('Home');
	 }
	 else
	 {
	   for (let i=0; i < this.state.dispatchs.length ; i++) {
	      pickers.push(<Button key={this.state.dispatchs[i].Dispatch} title = {this.state.dispatchs[i].DispatchName} value={i} onPress={()=>this.updateDispatch(i)} />);
       }
	   pickers.push(<Button key="close" title="Close Dispatch" onPress={()=>this.setState({isDispatchVisible: false})} />);
		this.setState({pickers: pickers});

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
			 <Text style={styles.getStartedText}> DispatchLatitude : {this.state.dispatchlatitude} </Text>
			 <Text style={styles.getStartedText}> DispatchLongitude: {this.state.dispatchlongitude} </Text>
			 <Text style={styles.getStartedText}> DispatchDistance : {this.state.dispatchdistance} </Text>
	        </View>
 );
};

async authEmpInstApi() {

 
	await fetch(URL + `authempinst_json.php?EmpNo=${this.state.EmpNo}&installationId=${Constants.installationId}&latitude=${this.state.latitude}&longitude=${this.state.longitude}&dev=${__DEV__}`)
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
		  if (this.state.auth.Screen != 'Dispatch')
		  {
			  this.props.navigation.navigate(this.state.auth.Screen);
		  }
		  this.setState({Dispatch: this.state.auth.Dispatch, Counter: this.state.auth.Counter, DispatchName: this.state.auth.DispatchName, DispatchNotes: this.state.auth.DispatchNotes, DispatchLocation: this.state.auth.location, dispatchlatitde: this.state.auth.latitude, dispatchlongitude: this.state.auth.longitude, dispatchdistance: this.state.auth.distance,Add1: this.state.auth.Add1, Add2: this.state.auth.Add2, City: this.state.auth.City, State: this.state.auth.State, Zip: this.state.auth.Zip, Phone1: this.state.auth.Phone1,event : this.state.auth.event, eventstatus: false, dispatchstatus: false, checkinStatus: 'Stop', active: false, isDispatchVisible: false}) 
	  }
	  
	  
     return this.state.auth;	
}

async authEventLogApi() {

	

	Screen = await AsyncStorage.getItem('Screen');
	let authurl = URL + `authempinst_json.php?EmpNo=${this.state.EmpNo}&installationId=${Constants.installationId}&event=${this.state.event}&Dispatch=${this.state.Dispatch}&Counter=${this.state.Counter}&checkinStatus=${this.state.checkinStatus}&Bio=${this.state.Bio}&violation=${this.state.violation}&image=${this.state.image}&latitude=${this.state.latitude}&longitude=${this.state.longitude}&Screen=${Screen}&addDispatchNote=${this.state.addDispatchNote}&dev=${__DEV__}`;
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
	  if (this.state.auth != null)
	  {
	  
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
	  }
	  
     return this.state.auth;	
}



_getLocationAsync = async () => {

	let { status } = await Permissions.askAsync(Permissions.LOCATION);
	if (status !== 'granted') 
	{
	   this.setState({locationstatus: status});
	}

}

gps_update = async () => {

	  this._getLocationAsync();
	  await this.authEmpInstApi();

	  if (!this.state.locationstatus)
	  {
		 let location = await Location.getCurrentPositionAsync({});
		 console.log(location);
		 this.setState({latitude: location.coords.latitude, longitude: location.coords.longitude});
		 
	  }
}


async componentDidMount ()  {

	 
	  
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
      this.intervalID = setInterval(this.gps_update, 5000);

}

error(err) {
  Alert.alert('ERROR(' + err.code + '): ' + err.message);
}

 componentWillUnmount() {

    navigator.geolocation.clearWatch(this.watchId);
    clearInterval(this.intervalID);
  }

 async checkStatus(override) {
	if (override)
	{
		this.setState({override: override});
	}
	if (this.state.checkinStatus == 'Start' && !this.state.dispatchstatus && !this.state.eventstatus && (this.state.event=='Traveling' || override || (this.state.event=='Working' && (this.state.dispatchdistance != null && this.state.dispatchdistance < 2)))) {
		await this.authEventLogApi();
		if (this.state.auth.EmpActive == '1')
		{
			this.setState({checkinStatus: 'Stop', active: !this.state.active});
			return false;
		}
	}
	else if (this.state.checkinStatus == 'Stop' && !this.state.dispatchstatus && !this.state.eventstatus) {
		await this.authEventLogApi();
		if (this.state.auth.EmpActive != '1')
		{
			this.setState({checkinStatus: 'Start', active: !this.state.active});
			this.props.navigation.navigate('Home');
			Alert.alert('Dispatch Work Done');
			return false;
		}
	}
	else
	 {
		if (this.state.checkinStatus == 'Start' && this.state.event== 'Working' && (this.state.dispatchdistance == null || this.state.dispatchdistance > 2))
		{
			Alert.alert('Not within range of ' + this.state.DispatchLocation + ' or gps not valid ' + this.state.dispatchdistance); 
			this.props.navigation.navigate('JobLocation', {onGoBack: () => this.checkStatus(true)});
			return false;
		}
	 }
	 if (this.state.LocName != 'Select Dispatch' && this.state.dispatchstatus)
	 {
		 Alert.alert(this.state.DispatcName + ' dispatch status state invalid');
		 return false;
	 }
	Alert.alert('Error ' + this.state.checkinStatus + ' ' + this.state.event + ' ' + this.state.auth.EmpActive);
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

 updateDispatchStatus = () => {


	   this.setState({dispatchstatus: !this.state.dispatchstatus, isDispatchVisible: true})
   
  
  }
 resetDispatchStatus = () => {
	 if (this.state.active)
	 {
		 this.updateDispatchStatus();
	 }
 }
resetEventStatus = () => {
	 if (this.state.active)
	 {
		 this.updateEventStatus();
	 }
 }
 updateDispatch = (i) => {

		console.log(this.state.dispatchs[i]);
		this.setState({ Dispatch: this.state.dispatchs[i].Dispatch, Counter: this.state.dispatchs[i].Counter, dispatchstatus: !this.state.dispatchstatus,  DispatchName: this.state.dispatchs[i].DispatchName, DispatchLocation: this.state.dispatchs[i].location, DispatchNotes: this.state.dispatchs[i].DispatchNotes, Add1: this.state.dispatchs[i].Add1, Add2: this.state.dispatchs[i].Add2, City: this.state.dispatchs[i].City, State: this.state.dispatchs[i].State, Zip: this.state.dispatchs[i].Zip, Phone1: this.state.dispatchs[i].Phone1, dispatchdistance: this.state.dispatchs[i].distance, dispatchlatitude: this.state.dispatchs[i].latitude, dispatchlongitude: this.state.dispatchs[i].longitude, isDispatchVisible: false })
	    console.log(this.state);
   }

renderAddress = () => {

	if (this.state.isLoading == true)
	{
		return false;
	}
	if (this.state.Add1 == '')
	{
		return false;
	}
	return(
		      <View style={styles.buttonContainer}>
			<Text style={styles.getStartedText}>
					Address: {this.state.Add1} {this.state.Add2}
            </Text>
			<Text style={styles.getStartedText}>
				  {this.state.City}, {this.state.State} {this.state.Zip}
            </Text>
			<Text style={styles.getStartedText}>
	             Phone: {this.state.Phone1}         
			</Text>
		</View>
	
		)
}

workingStatus = async () => {


	this.setState({checkinStatus: 'Start', event: 'Working'}); 
	//Alert.alert(this.state.checkinStatus + ' ' + this.state.event + ' for a living');

	const auth = await this.authEventLogApi();
	//Alert.alert(this.state.checkinStatus + ' ' + this.state.event + ' auth ' + auth.authorized);
	console.log(auth);
	this.setState({checkinStatus: 'Stop'});

	

}

renderMaybeWorking = () => {
	
	if (this.isLoading==true)
	{
		return false;
	}

	if (this.state.event != 'Traveling' || this.state.checkinStatus != 'Stop')
	{
		return false;
	}

	if (this.state.dispatchdistance != null &&  this.state.dispatchdistance > 2  && this.state.override == false)
	{
		return (
		<View style={styles.buttonContainer}>
			<Text>Distance to Dispatch {this.state.dispatchdistance}</Text>
		</View>);
		
	}

	return(
		<View style={styles.buttonContainer}>
<Button title="Switch Status to Working" onPress={this.workingStatus}  />
		</View>	
   );
}

dispatchCamera = () => {

	this.props.navigation.navigate('DispatchCamera', {onGoBack: () => this.setState({addDispatchPicture: true})});

}

customerComplete = () => {



	this.props.navigation.navigate('DispatchComplete');
}

renderCustomerComplete = () => {

	console.log(this.state.isLoading);
	if (this.state.isLoading==true)
	{
		return false;
	}
	console.log(this.state.event);
	console.log(this.state.checkinStatus);

	if (this.state.event != 'Working' || this.state.checkinStatus != 'Stop')
	{
		return false;
	}
	console.log(this.state.dispatchdistance);
	console.log(this.state.override);
	if (this.state.addDispatchPicture == false)
	{
		return(
		<View style={styles.buttonContainer}>
			<Button title="Add Picture" onPress={this.dispatchCamera}  />
		</View>	
		);
	}
	if (this.state.addDispatchNote == '')
	{
			return(
		<View style={styles.buttonContainer}>
			<Text>Note Needed to Complete Dispatch</Text>
		</View>);
	}
	if (this.state.dispatchdistance != null &&  this.state.dispatchdistance > 2 && this.state.override==false)
	{
	console.log('render distance');
		return(
		<View style={styles.buttonContainer}>
			<Text>Distance {this.state.dispatchdistance}</Text>
		</View>);
		
	}
	console.log('renderCustomerComplete');
	return(
		<View style={styles.buttonContainer}>
<Button title="Complete Job" onPress={this.customerComplete}  />
		</View>	
   );
}

visiableAddDispatchNote = () => {

	this.setState({isVisibleDispatchNote: true});
}


addDispatchNote = async () => {

	if (this.state.addDispatchNote == '' || this.state.checkinStatus != 'Stop')
	{
		console.log(this.state.data);
		this.setState({isVisibleDispatchNote: false});
		return false;
	}
	this.setState({checkinStatus: 'addNote'});
	const post = await this.authEventLogApi();

	console.log(post);
	this.setState({checkinStatus: 'Stop', DispatchNotes: post.DispatchNotes, isVisibleDispatchNote: false});
	
}

renderWorkingDispatchNotes = () => {
	if (this.isLoading==true)
	{
		return false
	}
	if (this.state.event != 'Working')
	{
		return false;
	}
	if (this.state.checkinStatus != 'Stop')
	{
		return false;
	}
	return(<View>
            <Modal animationType = {"slide"} transparent = {true}
                   visible = {this.state.isVisibleDispatchNote}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
   
  		        <ScrollView style={styles.buttonContainer}>
			      	    <TextInput placeholder="Note" multiline={true}     numberOfLines={4}
        style={styles.noteContainer}
                  onChangeText={data => this.setState({ addDispatchNote: data })}
      />
		   <Button key="Post" title="Post Note"

          onPress={this.addDispatchNote}

          style={styles.buttonContainer} value="Post" />

		   <Button key="Close" title="Close Note"

          onPress={() => this.setState({isVisibleDispatchNote: false})} value="Close"

          style={styles.buttonContainer} />
		        </ScrollView>
               </Modal>
		<View style={styles.buttonContainer}>
			<Button key="Open" title="Add Note" onPress={() => this.setState({isVisibleDispatchNote: true})} value="Open" />
		 </View>
        </View>
   )
}

 render() {


	
	return (

	<View style={styles.container}>
    <View style={styles.welcomeContainer}>
			<View style={styles.buttonContainer}>
   
	            <Modal animationType = {"slide"} transparent = {false}
                   visible = {this.state.isDispatchVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
                <ScrollView style={styles.buttonContainer}>
  		        <View style={styles.noteText}>
			      {this.state.pickers}
		        </View>
					</ScrollView>
               </Modal>
			  {
			   this.state.dispatchstatus? <Button title={this.state.DispatchName} onPress = {() => this.setState({isDispatchVisible: true})} /> : <Button style={styles.buttonContainer} title={this.state.DispatchName}  onPress={this.resetDispatchStatus} /> 
			   }
         </View>
	 {this.renderAddress()}
            <Modal animationType = {"slide"} transparent = {true}
                   visible = {this.state.isNotesVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
   
  		        <ScrollView style={styles.buttonContainer}>
				<Text style={styles.noteText}>
			      {this.state.DispatchNotes}
                </Text>
                <Button title="Close Notes" onPress={()=>this.setState({isNotesVisible: false})} />
				</ScrollView>
				
               </Modal>

			<View style={styles.jobNotesContainer}>
		      <TouchableHighlight onPress={() => this.setState({isNotesVisible: true})}>
				<Text style={styles.getStartedText}>
	          Notes {this.state.DispatchNotes}
	          </Text>
				  </TouchableHighlight>

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
			     <View style={styles.noteText} >

	           <Button title="Traveling" onPress={()=>this.updateEvent('Traveling')} />
		           <Button title="Working" onPress={()=>this.updateEvent('Working')} />
				   <Button title="Close Event" onPress={()=>this.setState({isEventVisible: false})} />
				</View>
			   </ScrollView>
      </Modal>
		{
    	    this.state.eventstatus? <Button title={this.state.event} onPress = {() => this.setState({isEventVisible: true})} /> : <Button style={styles.buttonContainer} title={this.state.event}  onPress={this.resetEventStatus} /> 
         }
		</View>

      	   
			<View style={styles.buttonContainer}>
		      <Text style={styles.getStartedText}>
               Status {this.state.checkinStatus} {this.state.event} at Dispatch# {this.state.Dispatch}
	          </Text>
	 {this.renderMaybeWorking()}
	 {this.renderCustomerComplete()}
	 {this.renderWorkingDispatchNotes()}

            </View>
	   

	
	</View>
    </View>
    );
 }
}

