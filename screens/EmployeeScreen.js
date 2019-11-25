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
  NetInfo
} from 'react-native';
import Expo, { Constants } from 'expo';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';


import styles from '../components/styles';
import * as lib from '../components/lib';

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
		even: null,
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
		isDispatchVisible: false,
		isScreenVisible: false,
		isJobVisible: false,
		isSwitch: false,
		addEmployeeNote: '',
		addDispatchNote: '',
		addJobNote: '',
		dispatched: null,
		jobed: null,
		intervalID: null,
        gps: __DEV__,
		change: 'ES11222019'
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


		var auth = await lib.fetch_authemp(URL + `authempinst_json.php?EmpNo=${this.state.EmpNo}&installationId=${Constants.installationId}&version=${Constants.manifest.version}&latitude=${this.state.latitude}&longitude=${this.state.longitude}&dev=${__DEV__}&change=${this.state.change}`);
			if (auth)
			{
			    await this.setState({auth: auth});

			}
	  if (auth && auth.note)
	  {
		  console.log('here it is ' + auth.note);
	  }
      //console.log(this.state.auth);
	  if (auth.authorized == 0)
	  {
		  this.props.navigation.navigate('Alternative');
		  console.log('not authorized');
	  }
	  this.fetchDispatchsFromApi(auth);
	  this.fetchJobsFromApi(auth);
	  if (auth.EmpActive == 1)
	  {
		  console.log('logged in');
		  if (auth.Screen != 'Employee')
		  {
			  //this.props.navigation.navigate(this.state.auth.Screen);
			  //return false;
		  }
		  await this.setState({event : auth.event, eventstatus: false,  checkinStatus: 'Stop', active: false, Screen: auth.Screen}); 

	  }
	  else if (this.state.checkinStatus != 'Stop' && this.state.checkinStatus != 'Start' && this.state.auth && this.state.auth.authorized == '1' )
	  {
		  await this.setState({checkinStatus: 'Start', active: true, Screen: auth.Screen});

	  }
	  else if (this.state.auth.EmpActive == null)
	  {
		  await this.setState({checkinStatus: 'Start', active: true});

	  }

	  
     return auth;	
}

async authEventLogApi(log) {

	
	if (__DEV__ && this.state.latitude == null)
	{
		this.setState({latitude: '33.3333', longitude: '-88.9888'});
	}

	violation = encodeURIComponent(this.state.violation);
	addEmployeeNote = encodeURIComponent(this.state.addEmployeeNote);
	if (!log && this.state.checkinStatus == 'Stop' && this.state.auth )
	{
		log = this.state.auth;
		log.checkinStatus = this.state.checkinStatus;
		//console.log(log);
	}
	else if (this.state.checkinStatus == 'Stop' && !log)
	{
		return false;
	}
	console.log(log);
	if (log && log.Screen && log.EmpNo && log.event && log.checkinStatus)
	{		
	   addNote = encodeURIComponent(log.addNote);
	   violation = encodeURIComponent(log.violation);

	   var authurl = URL + `authempinst_json.php?EmpNo=${log.EmpNo}&installationId=${Constants.installationId}&version=${Constants.manifest.version}&event=${log.event}&checkinStatus=${log.checkinStatus}&addNote=${addNote}&violation=${violation}&image=${log.image}&latitude=${this.state.latitude}&longitude=${this.state.longitude}&Screen=${log.Screen}&dev=${__DEV__}`;
	   if (log.Screen == 'Dispatch' && log.Dispatch)
	   {
		   var authurl = authurl + '&Dispatch=' + log.Dispatch + '&Counter=' + log.Counter;
		   console.log(authurl);
		}
	}
	else
	{
		var authurl = URL + `authempinst_json.php?EmpNo=${this.state.EmpNo}&installationId=${Constants.installationId}&version=${Constants.manifest.version}&event=${this.state.event}&checkinStatus=${this.state.checkinStatus}&addEmployeeNote=${addEmployeeNote}&Bio=${this.state.Bio}&violation=${violation}&image=${this.state.image}&latitude=${this.state.latitude}&longitude=${this.state.longitude}&Screen=${this.state.Screen}&dev=${__DEV__}`;
	}
	if (!authurl)
	{
		return false;
	}
	var auth = await lib.fetch_authemp(authurl);
		if (auth)
			{
			    await this.setState({auth: auth});
				if (auth.error)
				{
					Alert.alert(auth.error);
				}
			}
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

async fetchJobsFromApi(auth) {

	 if (!this.state.jobed)
	 {
		 jobed = lib.getItem('jobed');
	 }
	 if (jobed)
	 {
		 this.setState({jobed: jobed});
	 }
	 if (auth.jobs == null)
	 {
		 return false;
	 }
	 console.log(auth.jobs);
	 var pickers = [];
	 for (let i=0; i < auth.jobs.length ; i++) {
        if (auth.jobs[i].LocName)
        {
			auth.jobs[i].title = auth.jobs[i].Name + ' ' + auth.jobs[i].LocName;
		    pickers.push(<Button key={auth.jobs[i].Name} title = {auth.jobs[i].title} value={i} onPress={()=>this.updateJob(i)} />);

		}
     }
	 pickers.push(<Button key="close" title="Back" onPress={()=>this.setState({isJobVisible: false})} />);
	//console.log(pickers);
	auth.jobpickers = pickers;
	await this.setState({auth: auth});
	
}

async fetchDispatchsFromApi(auth) {

 
		if (!this.state.dispatched)
		{
			dispatched = lib.getItem('dispatched')
		}
		if (dispatched)
		{
			console.log('dispatched');
			this.setState({dispatched: dispatched})
		}
	
	if (!auth.dispatchs)
	{
		console.log('no dispatchs');
		return false;
	}

	var pickers = [];

	 if (auth.dispatchs == null)
	 {
		
		console.log('no dispatchs');
	 }
	 else
	 {
		 console.log('picking' + auth.dispatchs.length);
	   for (let i=0; i < auth.dispatchs.length ; i++) {
		  if (__DEV__)
		  {
			 auth.dispatchs[i].title = i + ' ' + auth.dispatchs[i].Dispatch + '-' + auth.dispatchs[i].Counter + ' ' + auth.dispatchs[i].DispatchName;
		  }
		  else
		  {
			 auth.dispatchs[i].title = i + ' ' + auth.dispatchs[i].Dispatch + '-' + auth.dispatchs[i].Counter + ' ' + auth.dispatchs[i].DispatchName;
		  }
		  auth.dispatchs[i].dispatchkey = i;
		  console.log(auth.dispatchs[i].Dispatch);
	      pickers.push(<Button key={auth.dispatchs[i].Dispatch} title = {auth.dispatchs[i].title} value={i} onPress={()=>this.updateDispatch(i)} />);
       }
	   pickers.push(<Button key="close" title="Back" onPress={()=>this.setState({isDispatchVisible: false})} />);
	   auth.dispatchpickers = pickers;
	   auth.title = 'Dispatch';
	   auth.DispatchName = 'Select Dispatch';
	   //console.log(pickers);
		await this.setState({auth: auth});

	 }
	//console.log(auth.dispatchpickers);
}

 updateJob = async (i) => {
		//i = i - 1;
		console.log('i ' + i);
		if (this.state.auth.jobs[i])
		{
			console.log('updating jobed updateJob');
			await this.setState({jobed: this.state.auth.jobs[i], isJobVisible: false, jobkey: i});
			lib.setItem('jobed', this.state.auth.jobs[i]);

		}
		else
		{
			console.log('no jobs ' + i);
				//console.log(this.state.auth.dispatchs[0]);
		}
	 await this.checkSwitch();
	await  this.setState({isSwitch: true});

   }

 updateDispatch = async (i) => {
		//i = i - 1;
		console.log('i ' + i);
		if (this.state.auth.dispatchs[i])
		{
			console.log('updating dispatched update Dispatch');
			await this.setState({dispatched: this.state.auth.dispatchs[i], isDispatchVisible: false, dispatchkey: i});
			lib.setItem('dispatched', this.state.auth.dispatchs[i]);
			//console.log(dispatched);

		}
		else
		{
			console.log('no dispatchs ' + i);
				//console.log(this.state.auth.dispatchs[0]);
		}
	 await this.checkSwitch();
	await  this.setState({isSwitch: true});

   }

renderScreenModal = () => {

if (!this.state.Screen)
{
	this.state.Screen = 'Employee'
}

if (this.state.auth && this.state.auth.dispatchs)
{
	var Dispatch = <Button title='Dispatch' onPress={()=>this.updateScreen('Dispatch')} />
}

if (this.state.auth && this.state.auth.jobs)
{
	var Jobs = <Button title='Job' onPress={()=>this.updateScreen('Job')} />
}
return (
			<View style={styles.buttonContainer}>

    <Modal animationType = {"slide"} transparent = {true}
                   visible = {this.state.isScreenVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
  		        <ScrollView style={styles.buttonContainer}>
					   <View style={styles.noteText}>
	           <Button title="Employee" onPress={()=>this.updateScreen('Employee')} />
	{Jobs}
	{Dispatch}
					   <Button title="Close Screen" onPress={()=>this.setState({isScreenVisible: false})} />
				   </View>
		        </ScrollView>
      </Modal>
<Button title={this.state.Screen} onPress = {() => this.setState({isScreenVisible: true})} />
		</View>
		);
}	

renderJobModal = ()  => {
	if (this.state.Screen != 'Job')
	{
		return false;
	}
	console.log('renderJobModal');

	if (!this.state.auth)
	{
		console.log('no auth');
		return false;
	}

    if (!this.state.auth.jobpickers)
    {
		console.log('still no jobpickers');
		return false;
    }

	if (!this.state.jobed)
	{
		console.log('not jobed');
		return false;
	}
	if (!this.state.jobed.title)
	{
		this.state.jobed.title = 'Select Job';
	}
	//console.log(dispatched);

	//console.log(this.state.dispatched);
	return (
			<View style={styles.buttonContainer}>
   
	            <Modal animationType = {"slide"} transparent = {false}
                   visible = {this.state.isJobVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
                <ScrollView style={styles.buttonContainer}>
  		        <View style={styles.noteText}>
			      {this.state.auth.jobpickers}
		        </View>
					</ScrollView>
               </Modal>
				<Button title={this.state.jobed.title} onPress = {() => this.setState({isJobVisible: true})} /> 
			   
         </View>
	  );
}



renderDispatchModal = ()  => {

	if (this.state.Screen != 'Dispatch')
	{
		return false;
	}

	if (!this.state.auth)
	{
		console.log('no auth');
		return false;
	}
	if (this.state.auth && this.state.dispatchs)
	{
		console.log('fetching dispatchpickers');

		this.fetchDispatchsFromApi(this.state.auth);
	}
    if (!this.state.auth.dispatchpickers)
    {
		console.log('still no dispatchpickers');
		return false;
    }
	if (!this.state.dispatched)
	{
		console.log('not dispatched');
		return false;
	}

	//console.log(dispatched);
	if (!this.state.dispatched.title)
	{
		this.state.dispatched.title = 'Select Dispatch';
	}
	//console.log(this.state.dispatched);
	return (
			<View style={styles.buttonContainer}>
   
	            <Modal animationType = {"slide"} transparent = {false}
                   visible = {this.state.isDispatchVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
                <ScrollView style={styles.buttonContainer}>
  		        <View style={styles.noteText}>
			      {this.state.auth.dispatchpickers}
		        </View>
					</ScrollView>
               </Modal>
			  {
			   this.state.dispatchstatus? <Button title={this.state.dispatched.title} onPress = {() => this.setState({isDispatchVisible: true})} /> : <Button style={styles.buttonContainer} title={this.state.dispatched.title}  onPress={() => this.resetDispatchStatus()} /> 
			   }
         </View>
	  );
}

async employeeLogin() {


	  var auth = await this.authEmpInstApi();

	  console.log('componentDidMount authEmpInstApi');
	  await this.setState({auth: auth});
	 

	  if (auth)
	  {
		  console.log('auth before login');
		  //console.log(auth);
		  if (!auth.EmpActive)
		  {


			  auth.Screen = 'Employee';
			  auth.event = 'Working';
			  auth.checkinStatus = 'Start';
			  auth.addEmployeeNote = 'Logging In';
			  var auth = await this.authEventLogApi(auth);
			  var auth = await this.authEmpInstApi();
		   }
		  await this.setState({auth: auth});

	  }
	  else
	  {
	    //not authorized
	  }

	return auth;
}

 async componentDidMount () {

	  console.log('componentDidMount');
	  await this._getLocationAsync().catch((error) => { console.log(error)});
	  if (!this.state.locationstatus)
	  {
	
		 var location = await Location.watchPositionAsync({}, this.gps_update).catch((error) => { console.log(error)});
		 console.log(location);

		 
	  }
	  const EmpName =  AsyncStorage.getItem('EmpName');
	  this.setState({EmpName: EmpName});

	  const Email =  AsyncStorage.getItem('Email');
	  this.setState({Email: Email});

	  const EmpNo =  await AsyncStorage.getItem('EmpNo');
	  await this.setState({EmpNo: EmpNo});

	  const Bio =  AsyncStorage.getItem('Bio');
	  this.setState({Bio: Bio});
	  const violation =  AsyncStorage.getItem('violation');
	  const image = AsyncStorage.getItem('image');
	  this.setState({violation: violation, image: image});
	  var auth =  this.employeeLogin();
			  
	
  
}

error(err) {
  Alert.alert('ERROR(' + err.code + '): ' + err.message);
}
componentWillMount() {

	  console.log('componentWillMount ');



}

 componentWillUnmount() {

    navigator.geolocation.clearWatch(this.watchId);
    clearInterval();
  }

addPicture() {

	if (this.state.auth.Screen == 'Job')
	{
		this.jobOverride();
	}
	if (this.state.auth.Screen == 'Dispatch')
	{
		this.dispatchOveride();
	}

}
 async checkStatus() {
	console.log('checkStatus ' + this.state.checkinStatus);
	if (this.state.checkinStatus == 'addPicture')
	{
		this.addPicture();
		return false;
	}
	if (this.state.checkinStatus == 'Switch')
	{
		var auth = this.switchEvent(this.state.even);
		return false;

	}

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
	console.log(this.state.checkinStatus);	
	if (this.state.checkinStatus == 'Start'  && !this.state.eventstatus && this.state.addEmployeeNote != '') {
		await this.authEventLogApi();
		if (this.state.auth.EmpActive == '1')
		{
			this.setState({checkinStatus: 'Stop', active: !this.state.active, addEmployeeNote: ''});
			return false;
		}
	}
	else if (this.state.checkinStatus == 'Stop'  && !this.state.eventstatus) {
			var auth = await this.authEventLogApi();
			if (auth.EmpActive != '1')
			{

				this.setState({checkinStatus: 'Start', active: !this.state.active});
				Alert.alert('Employee Stop Working');
				this.props.navigation.navigate('Home');

				return false;
			}
	
	}
	//console.log(this.state.auth);

	Alert.alert('Error ' + this.state.checkinStatus + ' ' + this.state.event + ' ' + this.state.auth.EmpActive + ' ' + this.state.eventstatus);

	//console.log(this.state);

}

 updateScreen = async (Screen) => {
		console.log(Screen);
		await   this.setState({ Screen: Screen, isScreenVisible: false })

		await this.checkSwitch();
       //this.setState({isEventVisible: false});
   }

  updateEvent = async (event) => {
		console.log(event);
		 await this.setState({ event: event, isEventVisible: false })

		await this.checkSwitch();
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


return(
	<View style={styles.buttonContainer}>
			<Button key="Open" title="Add Note" onPress={() => this.setState({isNotesVisible: true})} value="Open" />
		 </View>
);
}



addToNote = async () => {

var log;
		console.log('log setup addToNote');
		log = this.state.auth;
		console.log(log);
	if ((this.state.checkinStatus != 'Stop' && this.state.checkinStatus != 'addNote')  || !this.state.isNotesVisible )
	{
		Alert.alert('Erorr Status Note ');
		return false;
	}
	await this.setState({checkinStatus: 'addNote', isNotesVisible: false});
	log.checkinStatus = this.state.checkinStatus;
	log.Screen = this.state.Screen;
	if (log.Screen == 'Dispatch')
	{
		log.addDispatchNote = this.state.addDispatchNote;
		log.Dispatch = this.state.dispatched.Dispatch;
	}
	if (log.Screen == 'Job')
	{
		log.addJobNote = this.state.addJobNote;
		log.Name = this.state.jobed.Name;
	}
	if (log.screen == 'Employee')
	{
		log.addEmployeeNote = this.state.addEmployeeNote;

	}
	
	var authurl = await lib.url_create(log);
	console.log(authurl);

	var auth = await lib.add_url(authurl);
	//console.log(auth);
	await this.authEmpInstApi();
	await this.setState({checkinStatus: 'Stop'});

return auth;
}


renderDispatchNotes = () => {

	if (this.state.Screen != 'Dispatch')
	{
		return false;
	}
	if (!this.state.dispatched || !this.state.dispatched.Dispatch)
	{
		console.log('no dispatched renderDispatchNotes')
		
		return false;
	}
	else
	{
		console.log('looking to renderDispatchNotes');
	}
        return ( 
						<View style={styles.buttonContainer}>
 
  <Modal animationType = {"slide"} transparent = {true}
                   visible = {this.state.isNotesVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
  		        <ScrollView style={styles.buttonContainer}>

   
				<View style={styles.noteboxContainer}>
		  		                  <Button title="Add To Notes" onPress={()=>this.addToNote()} />
                <Button title="Back" onPress={()=>this.setState({isNotesVisible: false})} />
				</View>
			<TextInput  multiline={true}     numberOfLines={4} style={styles.noteContainer}
                  onChangeText={data => this.setState({addDispatchNote: data })}
      />


				<Text style={styles.noteText}>
			      {this.state.dispatched.DispatchNotes}
		  	 {this.state.notes}

                </Text>
	
				</ScrollView>
				
               </Modal>

				   </View>
	);
}

renderJobNotes = () => {

	if (this.state.Screen != 'Job')
	{
		console.log('No Job');
		return false;
	}
	if (!this.state.jobed || !this.state.jobed.Name)
	{
		console.log('No Jobed/Name');
		return false;
	}
	else
	{
		console.log('looking to renderJobNotes');
	}
        return ( 
						<View style={styles.buttonContainer}>
 
  <Modal animationType = {"slide"} transparent = {true}
                   visible = {this.state.isNotesVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
  		        <ScrollView style={styles.buttonContainer}>

   
				<View style={styles.noteboxContainer}>
		  		                  <Button title="Add To Notes" onPress={()=>this.addToNote()} />
                <Button title="Back" onPress={()=>this.setState({isNotesVisible: false})} />
				</View>
			<TextInput  multiline={true}     numberOfLines={4} style={styles.noteContainer}
                  onChangeText={data => this.setState({addJobNote: data })}
      />


				<Text style={styles.noteText}>
			      {this.state.jobed.JobNotes}
		  	 {this.state.notes}

                </Text>
	
				</ScrollView>
				
               </Modal>

				   </View>
	);
}

renderEmployeeNotes = () => {

	if (this.state.Screen != 'Employee')
	{
		return false;
	}
	return(<View>
            <Modal animationType = {"slide"} transparent = {false}
                   visible = {this.state.isNotesVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
   
  		        <ScrollView style={styles.buttonContainer}>
	  		                  <Button title="Add To Notes" onPress={()=>this.addToNote()} />
                <Button title="Back" onPress={()=>this.setState({isNotesVisible: false})} />
			      	    <TextInput placeholder="Note" multiline={true}     numberOfLines={4}
        style={styles.noteContainer} value={this.state.addEmployeeNote} 
                  onChangeText={data => this.setState({ addEmployeeNote: data })}
      />
	

		        </ScrollView>
               </Modal>
				</View>
   );

}
renderCircle = () => {

	if (this.state.checkinStatus != 'Start' && this.state.checkinStatus != 'Stop' && this.state.checkinStatus != 'Switch' && this.state.checkinStatus != 'addPicture')
	{
		return (<View>			
	    <TouchableHighlight style={this.state.active? styles.circleContainerStart: styles.circleContainerStop}  >
	     <Text style={styles.getCircleText}> 
	 {this.state.checkinStatus}
	         </Text>
            </TouchableHighlight>
				 </View>);
	}

return (<View>			
	    <TouchableHighlight style={this.state.active? styles.circleContainerStart: styles.circleContainerStop} onPress = { () =>  this.checkStatus() } >
	     <Text style={styles.getCircleText}> 
	 {this.state.checkinStatus}
	         </Text>
            </TouchableHighlight>
				 </View>);
}


renderEventModal = () => {

console.log('renderEventModal');
console.log(this.state.Screen);
if (this.state.Screen != 'Employee')
{

return (
    <Modal animationType = {"slide"} transparent = {true}
                   visible = {this.state.isEventVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
  		        <ScrollView style={styles.buttonContainer}>
					   <View style={styles.noteText}>
	           <Button title="Traveling" onPress={()=>this.updateEvent('Traveling')} />
		           <Button title="Working" onPress={()=>this.updateEvent('Working')} />
					   <Button title="Close Event" onPress={()=>this.setState({isEventVisible: false})} />
				   </View>
		        </ScrollView>
      </Modal>
		);

}

return (
    <Modal animationType = {"slide"} transparent = {true}
                   visible = {this.state.isEventVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
  		        <ScrollView style={styles.buttonContainer}>
					   <View style={styles.noteText}>
	           <Button title="Traveling" onPress={()=>this.updateEvent('Traveling')} />
		           <Button title="Working" onPress={()=>this.updateEvent('Working')} />
		           <Button title="Lunch" onPress={()=>this.updateEvent('Lunch')} />

					   <Button title="Close Event" onPress={()=>this.setState({isEventVisible: false})} />
				   </View>
		        </ScrollView>
      </Modal>
		);


}
async switchEvent(even) {


	if (this.state.checkinStatus != 'Switch')
	{
		console.log('switchEvent ' + this.state.checkinStatus);
		return false;
	}
	if (this.state.Screen != 'Employee' && !even)
	{
		console.log('switchEvent no even');
		return false;
	}
	if (this.state.Screen == 'Employee')
	{
		console.log('switchEvent ' + this.state.Screen);
		console.log(even);
		var even = this.state;

	}
	even.Screen = this.state.Screen;
	even.event = this.state.event;
	even.checkinStatus = 'Switch';
	even.EmpNo = this.state.auth.EmpNo;

	Alert.alert('Switching to ' + even.Screen + ' ' + even.event);


	var auth = await this.authEventLogApi(even);
	//console.log(auth);
	 auth =  await this.authEmpInstApi();

return auth;
}


gps_update = async (location) => {

		console.log('gps update location');
		await this.setState({latitude: location.coords.latitude, longitude: location.coords.longitude});
		console.log(location);
		 if (this.state.dispatched && this.state.dispatched.latitude && this.state.dispatched.longitude && this.state.latitude && this.state.longitude)
		 {
			this.state.dispatched.distance = lib.getDistance(this.state.latitude, this.state.longitude, this.state.dispatched.latitude, this.state.dispatched.longitude);
			await this.setState({dispatched: this.state.dispatched});
			console.log('distance calculated ' + this.state.dispatched.distance);
		 }
		 if (this.state.jobed && this.state.jobed.latitude && this.state.jobed.longitude && this.state.latitude && this.state.longitude)
		 {
			this.state.dispatched.distance = lib.getDistance(this.state.latitude, this.state.longitude, this.state.jobed.latitude, this.state.jobed.longitude);
			await this.setState({jobed: this.state.jobed});
			console.log('distance calculated ' + this.state.jobed.distance);
		 }
}

checkSwitch = async (override) => {

console.log('checkSwitch' );

if (!this.state.auth || !this.state.auth.Screen || !this.state.auth.event)
{
	console.log('no auth/Screen/event');
	return false;
}
console.log(this.state.checkinStatus);
if (this.state.checkinStatus == 'Switch' && this.state.auth.Screen == this.state.Screen && this.state.auth.event == this.state.event)
{
	await this.setState({checkinStatus: 'Stop'});
}
console.log('check note dispatch');
console.log(this.state.auth.Screen);
console.log(this.state.auth.event);
console.log(this.state.auth.Dispatch);
console.log(this.state.auth.Counter);
console.log(this.state.auth.note);
if (this.state.checkinStatus == 'Stop' && this.state.auth.Screen == 'Dispatch' && (!this.state.auth.note || this.state.auth.note == null) && this.state.auth.event == 'Working')
{
	await this.setState({checkinStatus: 'addNote'});
}
if (this.state.Screen == 'Dispatch' && (!this.state.dispatched || !this.state.dispatched.Dispatch) && this.state.auth.Screen != this.state.Screen)
{
	console.log('No Dispatch/dispatched' + this.state.dispatched + this.state.Screen + this.state.dispatched.Dispatch);
	console.log(dispatched);
	return false;
}
if (this.state.Screen == 'Job' && (!this.state.jobed || !this.state.jobed.Name) && this.state.auth.Screen != this.state.Screen)
{
	console.log('No Job/jobed');
	return false;
}
console.log('checking travel working');
console.log(this.state.auth.Screen);
console.log(this.state.auth.event);
console.log(this.state.Screen);

if (this.state.auth.Screen == 'Dispatch' && this.state.auth.event == 'Traveling' && this.state.event == 'Working' && !override)
{
	console.log('dispatch traveling working check');
	if (this.state.dispatched)
	{
		console.log(this.state.dispatched.distance);
	}
	console.log(this.state.auth.picture);
	if ((this.state.dispatched && this.state.dispatched.distance < 2 || (this.state.auth && this.state.auth.picture)) )
	{
		this.setState({even: this.state.dispatched, checkinStatus: 'Switch'});
	}
	else 
	{
	}
	{
		this.setState({even: this.state.dispatched, checkinStatus: 'addPicture'});
	}
	
	return false;
}
if (this.state.auth.Screen == 'Job' && this.state.auth.event == 'Traveling' && this.state.event == 'Working' && !override)
{
	console.log('dispatch traveling working check');
	if (this.state.jobed)
	{
		console.log(this.state.jobed.distance);
	}
	console.log(this.state.auth.picture);
	if ((this.state.jobed && this.state.jobed.distance < 2 || (this.state.auth && this.state.auth.picture)) )
	{
		this.setState({even: this.state.jobed, checkinStatus: 'Switch'});
	}
	else
	{
		this.setState({even: this.state.jobed, checkinStatus: 'addPicture'});
	}
	
	return false;
}

if (this.state.auth.Screen != this.state.Screen || this.state.auth.event != this.state.event)
{
	//var title = 'Switch To ' + this.state.Screen + ' ' + this.state.event;
	if (this.state.Screen == 'Dispatch' && this.state.dispatched && this.state.dispatched.Dispatch)
	{
		//var title = title + ' ' + this.state.dispatched.Dispatch;
		this.setState({even: this.state.dispatched, checkinStatus: 'Switch'});
		return false;
	}
	else if (this.state.Screen == 'Dispatch' && !this.state.dispatched)
	{
		return false;
	}
	else if (this.state.Screen == 'Employee')
	{
		this.setState({checkinStatus: 'Switch'});
		return false;
	}
	else if (this.state.Screen == 'Job' && this.state.jobed && this.state.jobed.Name)
	{
		this.setState({even: this.state.jobed, checkinStatus: 'Switch'});
		return false;

	} 
	else if (this.state.Screen == 'Job' && !this.state.jobed)
	{
		return false;
	}

}

}

dispatchComplete = async () => {


	var img = await lib.uploadImages();
	if (img && img > 0)
	{
				//uploaded images
	}
	else if (!img)
	{
		Alert.alert('Error Connection Image Upload');
		this.setState({isLoading: false});
		return false;
	}
			

	this.setState({isLoading: false});
	this.props.navigation.navigate('DispatchComplete', {onGoBack: () => this.employeeLogin()});
}

renderDispatchComplete = () => {

	if (this.state.Screen != 'Dispatch')
	{
		return false;
	}
	if (this.state.event != 'Working' || this.state.checkinStatus != 'Stop')
	{
		return false;
	}

	return(
		<View style={styles.buttonContainer}>
<Button title="Complete Dispatch" onPress={this.dispatchComplete}  />
		</View>	
   );
}

renderCurrentStatus = () => {

if (!this.state.auth || !this.state.auth.Screen ||  !this.state.auth.event)
{
	//console.log(auth);
	return false;

}
if (this.state.dispatched && this.state.dispatched.distance && this.state.event == 'Working' && this.state.auth.event == 'Traveling')
{
	var distanced = `Distance ${this.state.dispatched.distance}`
}
if (this.state.jobed && this.state.jobed.distance && this.state.event == 'Working' && this.state.auth.event == 'Traveling')
{
	var distanced = `Distance ${this.state.jobed.distance}`
}
return (<View>
	      <Text style={styles.getStartedText}>
               Status {this.state.auth.Screen} {this.state.auth.checkinStatus} {this.state.auth.event} {this.state.auth.Dispatch} {distanced}
	          </Text>
		</View>
  );
}

renderDispatchAddress = () => {


	if (!this.state.dispatched)
	{
		return false;
	}
	if (!this.state.dispatched.Add1)
	{
		return false;
	}
	if (this.state.Screen != 'Dispatch')
	{
		return false;
	}

	return(
		<View style={styles.buttonContainer}>
		      <TouchableHighlight  onPress={()=>lib.mapDirections(`${this.state.dispatched.Add1}, ${this.state.dispatched.City} ${this.state.dispatched.State} ${this.state.dispatched.Zip}` )}>
			<Text style={styles.getStartedText}>
					Address: {this.state.dispatched.Add1} {this.state.dispatched.Add2} {"\n"}
				  {this.state.dispatched.City}, {this.state.dispatched.State} {this.state.dispatched.Zip}  {"\n"}
	              Phone: {this.state.dispatched.Phone1}         
			</Text>
	</TouchableHighlight>
		</View>
	
		)
}

renderJobAddress = () => {


	if (!this.state.jobed)
	{
		return false;
	}
	if (!this.state.jobed.Add1)
	{
		return false;
	}
	if (this.state.Screen != 'Job')
	{
		return false;
	}

	return(
		<View style={styles.buttonContainer}>
		      <TouchableHighlight  onPress={()=>lib.mapDirections(`${this.state.jobed.Add1}, ${this.state.jobed.City} ${this.state.jobed.State} ${this.state.jobed.Zip}` )}>
			<Text style={styles.getStartedText}>
					Address: {this.state.jobed.Add1} {this.state.jobed.Add2} {"\n"}
				  {this.state.jobed.City}, {this.state.jobed.State} {this.state.jobed.Zip}  {"\n"}
	              Phone: {this.state.jobed.Phone1}         
			</Text>
	</TouchableHighlight>
		</View>
	
		)
}

async loadPictures () {

		pictures = await lib.getItem('pictures');

		if (pictures && pictures.length > 0)
		{
			this.setState({pictures: pictures});
		}
		
return true;
}

dispatchCamera = () => {

	this.props.navigation.navigate('Picture', {onGoBack: () => this.loadPictures() , Screen: 'DispatchCamera',LocName: this.state.auth.DispatchName, address: 'DispatchCamera', reference: this.state.auth.Dispatch});

}
jobCamera = () => {

	this.props.navigation.navigate('Picture', {onGoBack: () => this.loadPictures() , Screen: 'JobCamera',LocName: this.state.auth.LocName, address: 'JobCamera', reference: this.state.auth.Name});

}
dispatchOverride = () => {

	this.props.navigation.navigate('Picture', {onGoBack: () => this.checkSwitch(true), Screen: 'DispatchOverride', address: this.state.auth.DispatchLocation, reference: this.state.auth.Dispatch, LocName: this.state.auth.DispatchLocation});

}

jobOverride = () => {

	this.props.navigation.navigate('Picture', {onGoBack: () => this.checkSwitch(true), Screen: 'JobOverride', address: this.state.auth.JobLocation, reference: this.state.auth.Name, LocName: this.state.auth.JobLocation});

}


renderDispatchWorking = () => {

	if (!this.state.auth)
	{
		return false;
	}
	if (this.state.auth.event != 'Working')
	{
		return false;
	}

	if (this.state.auth.Screen != 'Dispatch')
	{
		return false;
	}
	return(
		<View style={styles.buttonContainer}>

			<Button title="Add Picture" onPress={() => this.dispatchCamera()}  />
		</View>	
   );

}

renderJobWorking = () => {

	if (!this.state.auth)
	{
		return false;
	}
	if (this.state.auth.event != 'Working')
	{
		return false;
	}

	if (this.state.auth.Screen != 'Job')
	{
		return false;
	}
	return(
		<View style={styles.buttonContainer}>

			<Button title="Add Picture" onPress={() => this.jobCamera()}  />
		</View>	
   );

}

 render() {


	if (!this.state.latitude)
	{
				return ( 
	<View style={styles.container}>
    <View style={styles.welcomeContainer}>
			<Text style={styles.noteText}> Loading... </Text>
    </View>
	</View>
			);
	}
	
	return (

	<View style={styles.container}>
    <View style={styles.welcomeContainer}>
	 {this.renderScreenModal()}
	 {this.renderJobModal()}
	 {this.renderJobAddress()}
	 {this.renderJobNotes()}
	 {this.renderDispatchModal()}
	 {this.renderDispatchAddress()}
	 {this.renderDispatchNotes()}
	 {this.renderCircle()}
	

   	 <View style={styles.buttonContainer}>
	 {this.renderEventModal()}
	
    	    <Button title={this.state.event} onPress = {() => this.setState({isEventVisible: true})} />
      
		</View>

      	   
			<View style={styles.buttonContainer}>
	 {this.renderCurrentStatus()}

            </View>
	 {this.renderDispatchComplete()}
	 {this.addNote()}
	 {this.renderDispatchWorking()}
	 {this.renderJobWorking()}
	 {this.renderEmployeeNotes()}

			{this.renderGPS()}     

	
	</View>
    </View>
    );
 }
}

