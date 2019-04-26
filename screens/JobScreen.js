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




export default class JobScreen extends Component {

	  watchID: ?number = null;


constructor(props){
    super(props);
    this.state = {

        Name: '',
		JobID: null,
	    LocName: 'Select Job',
	    JobNotes: null,
		JobLocation: null,
		addJobNote: '',
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
        jobs: null,
        job: null,
		jobstatus: true,
        pickers: null,
        auth: null,
		timer: null,
        violation: null,
	    image: null,
		lastposition: null,
		locationstatus: null,
        joblatitude: null,
		joblongitude: null,
		jobdistance: null,
        isJobVisible: false,
		isEventVisible: false,
		isNotesVisible: false,
        isVisibleJobNote: false,
		isTimeHome: true,
		override: false,
        gps: __DEV__,
    }

}

async fetchJobsFromApi() {

	 
	await fetch(URL + `jobs_json.php?latitude=${this.state.latitude}&longitude=${this.state.longitude}&EmpNo=${this.state.EmpNo}&ServiceMan=${this.state.EmpNo}&installationId=${Constants.installationId}&dev=${__DEV__}`)
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          jobs: responseJson.jobs,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
	  let pickers = [];
	 for (let i=0; i < this.state.jobs.length ; i++) {
	    pickers.push(<Button key={this.state.jobs[i].Name} title = {this.state.jobs[i].LocName} value={i} onPress={()=>this.updateJob(i)} />);
     }
	 pickers.push(<Button key="close" title="Back" onPress={()=>this.setState({isJobVisible: false})} />);
	//console.log(pickers);
	this.setState({pickers: pickers});
	
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
			 <Text style={styles.getStartedText}> JobLatitude : {this.state.joblatitude} </Text>
			 <Text style={styles.getStartedText}> JobLongitude: {this.state.joblongitude} </Text>
			 <Text style={styles.getStartedText}> JobDistance : {this.state.jobdistance} </Text>
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
	  else
	{
		  		  	  await this.fetchJobsFromApi();
	}
	  if (this.state.auth.EmpActive == 1 && this.state.auth.Screen == 'Job')
	  {
		  console.log('logged in');
		  this.setState({Name: this.state.auth.Name, JobID: this.state.auth.JobID, LocName: this.state.auth.LocName, JobNotes: this.state.auth.JobNotes, jobdistance: this.state.auth.distance, joblatitude: this.state.auth.latitude, joblongitude: this.state.auth.longitude, event : this.state.auth.event, eventstatus: false, jobstatus: false, checkinStatus: 'Stop', active: false, isJobVisible: false}) 
	  }
      if (this.state.auth.EmpActive == 1 && this.state.auth.Screen != 'Job')
	 {
         this.props.navigation.navigate(this.state.auth.Screen);
	 } 
	  
     return this.state.auth;	
}

async authEventLogApi() {

	

	Screen = await AsyncStorage.getItem('Screen');
	let authurl = URL + `authempinst_json.php?EmpNo=${this.state.EmpNo}&installationId=${Constants.installationId}&event=${this.state.event}&Name=${this.state.Name}&JobID=${this.state.JobID}&addJobNote=${this.state.addJobNote}&checkinStatus=${this.state.checkinStatus}&Bio=${this.state.Bio}&violation=${this.state.violation}&image=${this.state.image}&latitude=${this.state.latitude}&longitude=${this.state.longitude}&Screen=${Screen}&dev=${__DEV__}`;
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
	  else
	{
	}
	  if (this.state.auth.EmpActive == 1)
	  {
		  if (this.state.auth.Screen == 'Job')
		  {
			  console.log('logged in');

		  }
		  else
		  {
			  console.log('logged in at ' . this.state.auth.Screen);
			  this.props.navigation.navigate(this.state.auth.Screen);
		  }
	  }
	  else
	 {
		  console.log('logged out');
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

async componentDidMount () {


	 	
	  const EmpName = await AsyncStorage.getItem('EmpName');
	  this.setState({EmpName: EmpName});

	  const Email = await AsyncStorage.getItem('Email');
	  this.setState({Email: Email});

	  const EmpNo = await AsyncStorage.getItem('EmpNo');
	  this.setState({EmpNo: EmpNo});
	  await this.fetchJobsFromApi();

	  const Bio = await AsyncStorage.getItem('Bio');
	  this.setState({Bio: Bio});
	  const violation = await AsyncStorage.getItem('violation');
	  const image = await AsyncStorage.getItem('image');
	  this.setState({violation: violation, image: image});

	  this.gps_update;
      this.intervalID = setInterval(this.gps_update, 5000);

	

  
}

error(err) {
  Alert.alert('ERROR(' + err.code + '): ' + err.message);
}

 componentWillUnmount() {

    clearInterval(this.intervalID);
  }

 async checkStatus(override) {
	
	if (this.state.checkinStatus == 'Start' && this.state.event=='Select Event')
	{
		Alert.alert('Job Event Required');
		return false;
	}
	

	if (this.state.checkinStatus == 'Start' && !this.state.jobstatus && !this.state.eventstatus && (this.state.event=='Traveling'  || (this.state.event=='Working' && (this.state.jobdistance != null && this.state.jobdistance < 2)) || override)) {
		await this.authEventLogApi();
		if (this.state.auth.EmpActive == '1')
		{
			this.setState({checkinStatus: 'Stop', active: !this.state.active});
			return false;
		}
	}
	else if (this.state.checkinStatus == 'Stop' && !this.state.jobstatus && !this.state.eventstatus) {
		await this.authEventLogApi();
		if (this.state.auth.EmpActive != '1')
		{
			this.setState({checkinStatus: 'Start', active: !this.state.active});
			this.props.navigation.navigate('Home');
			Alert.alert('Job Work Done');
			return false;
		}
	}
	else
	 {
		if (this.state.checkinStatus == 'Start' && this.state.event== 'Working' && (this.state.jobdistance == null || this.state.jobdistance > 2))
		{
			Alert.alert('Not within range of ' + this.state.JobLocation + ' or gps not valid ' + this.state.jobdistance); 
			this.props.navigation.navigate('JobLocation', {onGoBack: () => this.checkStatus(true), LocName: this.state.JobLocation});
			return false;
		}
	 }
	 if (this.state.LocName != 'Select Job' && this.state.jobstatus)
	 {
		 Alert.alert(this.state.LocName + ' job status state invalid');
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

 updateJobStatus = () => {

	   this.setState({jobstatus: !this.state.jobstatus, isJobVisible: true})
   
  
  }
 resetJobStatus = () => {
	 if (this.state.active)
	 {
		 this.updateJobStatus();
	 }
 }
resetEventStatus = () => {
	 if (this.state.active)
	 {
		 this.updateEventStatus();
	 }
 }
 updateJob = (i) => {
		//console.log(this.state.jobs);
		console.log(this.state.jobs[i]);
		this.setState({ job: this.state.jobs[i].Name, jobstatus: !this.state.jobstatus, Name: this.state.jobs[i].Name, JobID: this.state.jobs[i].JobID, LocName: this.state.jobs[i].LocName, JobNotes: this.state.jobs[i].JobNotes, JobLocation: this.state.jobs[i].location, jobdistance: this.state.jobs[i].distance, joblatitude: this.state.jobs[i].latitude, joblongitude: this.state.jobs[i].longitude, isJobVisible: false })
	    //console.log(this.state);
   }


addJobNote = async () => {

	if (this.state.addJobNote == '' || this.state.checkinStatus != 'Stop')
	{
		console.log(this.state.data);
		this.setState({isVisibleJobNote: false});
		return false;
	}
	this.setState({checkinStatus: 'addNote', isTimeHome:false});
	const post = await this.authEventLogApi();
	console.log(post);
	this.setState({checkinStatus: 'Stop', JobNotes: post.JobNotes, isVisibleJobNote: false});
	
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

	if (this.state.jobdistance != null &&  this.state.jobdistance > 2  && this.state.override == false)
	{
		return (
		<View style={styles.buttonContainer}>
			<Text>Distance to Job {this.state.jobdistance}</Text>
		</View>);
		
	}

	return(
		<View style={styles.buttonContainer}>
<Button title="Switch Status to Working" onPress={this.workingStatus}  />
		</View>	
   );
}

renderWorkingJobNotes = () => {
	if (this.isLoading==true)
	{
		return false;
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
            <Modal animationType = {"slide"} transparent = {false}
                   visible = {this.state.isVisibleJobNote}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
  		        <ScrollView style={styles.buttonContainer}>
   
			      	    <TextInput placeholder="Note" multiline={true}     numberOfLines={4}
        style={styles.noteContainer}
                  onChangeText={data => this.setState({ addJobNote: data })}
      />
		   <Button key="Post" title="Post Note"

          onPress={this.addJobNote}

          style={styles.buttonContainer} value="Post" />

		   <Button key="Close" title="Close Note"

          onPress={() => this.setState({isVisibleJobNote: false, isTimeHome:true})} value="Close"

          style={styles.buttonContainer} />
			
               </ScrollView>
               </Modal>
		<View style={styles.buttonContainer}>
			<Button key="Open" title="Add Note" onPress={() => this.setState({isVisibleJobNote: true, isTimeHome:false})} value="Open" />
			</View>
		  </View>
   )
}


			

 render() {


	
	return (

	<View style={styles.container}>
    <View style={styles.welcomeContainer}>
			<View style={styles.buttonContainer}>
   
	            <Modal animationType = {"slide"} transparent = {true}
                   visible = {this.state.isJobVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
   
  	           <ScrollView style={styles.buttonContainer}>
  		        <View style={styles.noteText}>
			      {this.state.pickers}
			   </View>
		        </ScrollView>
               </Modal>
			  {
			   this.state.jobstatus? <Button title={this.state.LocName} onPress = {() => this.setState({isJobVisible: true})} /> : <Button style={styles.buttonContainer} title={this.state.LocName}  onPress={this.resetJobStatus} /> 
			   }
         </View>

            <Modal animationType = {"slide"} transparent = {true}
                   visible = {this.state.isNotesVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
   
  		        <ScrollView style={styles.buttonContainer}>
				<Text style={styles.noteText}>
			      {this.state.JobNotes}
                </Text>
                <Button title="Close Notes" onPress={()=>this.setState({isNotesVisible: false})} />
				</ScrollView>
               </Modal>

			<View style={styles.jobNotesContainer}>
		      <TouchableHighlight onPress={() => this.setState({isNotesVisible: true})}>
				<Text style={styles.getStartedText}>
	          Notes {this.state.JobNotes}
	          </Text>
				  </TouchableHighlight>

            </View>
			<TouchableHighlight style={this.state.active? styles.circleContainerStart: styles.circleContainerStop} onPress = { () =>  this.checkStatus() } >
	     <Text style={styles.getCircleText}> 
	 {this.state.checkinStatus}
	         </Text>
            </TouchableHighlight>
	

   	 <View style={styles.buttonContainer}>
      <Modal animationType = {"slide"} transparent = {false}
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
               Status {this.state.checkinStatus} {this.state.event} at Job# {this.state.Name}
	          </Text>
			 {this.renderWorkingJobNotes()}
	 {this.renderMaybeWorking()}
            </View>

	
	</View>
    </View>
    );
 }
}

