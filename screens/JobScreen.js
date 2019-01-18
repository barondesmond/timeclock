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
  Modal
} from 'react-native';
import Expo, { Constants, Location, Permissions } from 'expo';

import styles from '../components/styles';

import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';


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


export default class JobScreen extends Component {

	  watchID: ?number = null;


constructor(props){
    super(props);
    this.state = {

        Name: '',
	    LocName: 'Select Job',
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
        gps: __DEV__,
    }

}

async fetchJobsFromApi() {

 
	await fetch(URL + `jobs_json.php?latitude=${this.state.latitude}&longitude=${this.state.longitude}`)
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

 
	await fetch(URL + `authempinst_json.php?EmpNo=${this.state.EmpNo}&installationId=${Constants.installationId}`)
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
		  this.setState({Name: this.state.auth.Name, LocName: this.state.auth.LocName, JobNotes: this.state.auth.JobNotes, event : this.state.auth.event, eventstatus: false, jobstatus: false, checkinStatus: 'Stop', active: false, isJobVisible: false}) 
	  }
	  
	  
     return this.state.auth;	
}

async authEventLogApi() {

	
	if (__DEV__ && this.state.latitude == null)
	{
		this.setState({latitude: '33.3333', longitude: '-88.9888'});
	}
	let authurl = URL + `authempinst_json.php?EmpNo=${this.state.EmpNo}&installationId=${Constants.installationId}&event=${this.state.event}&Name=${this.state.Name}&checkinStatus=${this.state.checkinStatus}&Bio=${this.state.Bio}&violation=${this.state.violation}&image=${this.state.image}&latitude=${this.state.latitude}&longitude=${this.state.longitude}`;
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
	  await this.fetchJobsFromApi();

  
}

error(err) {
  Alert.alert('ERROR(' + err.code + '): ' + err.message);
}

 componentWillUnmount() {

    navigator.geolocation.clearWatch(this.watchId);
    clearInterval();
  }

 async checkStatus() {
	
	if (this.state.checkinStatus == 'Start' && !this.state.jobstatus && !this.state.eventstatus && (this.state.event=='travel' || (this.state.event=='checkin' && (this.state.jobdistance == null || this.state.jobdistance < 2)))) {
		await this.authEventLogApi();
		if (this.state.auth.EmpActive == '1')
		{
			this.setState({checkinStatus: 'Stop', active: !this.state.active});
		}
	}
	else if (this.state.checkinStatus == 'Stop' && !this.state.jobstatus && !this.state.eventstatus) {
		await this.authEventLogApi();
		if (this.state.auth.EmpActive != '1')
		{
			this.setState({checkinStatus: 'Start', active: !this.state.active});
			this.updateEventStatus();
			this.updateJobStatus();

		}


	}

	//console.log(this.state);

}

  updateEvent = (event) => {

	   this.setState({ event: event, eventstatus: !this.state.eventstatus })

   }
   updateEventStatus = () => {
	  
	  this.setState({event: null, eventstatus: !this.state.eventstatus})
   }

 updateJobStatus = () => {

	   this.setState({job: null, jobstatus: !this.state.jobstatus , isJobVisible: true})
   
  
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
		this.setState({ job: this.state.jobs[i].Name, jobstatus: !this.state.jobstatus, Name: this.state.jobs[i].Name, LocName: this.state.jobs[i].LocName, JobNotes: this.state.jobs[i].JobNotes, jobdistance: this.state.jobs[i].distance, joblatitude: this.state.jobs[i].latitude, joblongitude: this.state.jobs[i].longitude, isJobVisible: false })
	    console.log(this.state);
   }
buttonDone = () => {

	//this.props.navigation.navigate('Home');
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
			      {this.state.pickers}
		        </ScrollView>
               </Modal>
			  {
			   this.state.jobstatus? <Button title="Select Job" onPress = {() => this.setState({isJobVisible: true})} /> : <Button style={styles.buttonContainer} title={this.state.LocName}  onPress={this.resetJobStatus} /> 
			   }
         </View>

            <Modal animationType = {"slide"} transparent = {true}
                   visible = {this.state.isNotesVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
   
  		        <ScrollView style={styles.buttonContainer}>
				<Text style={styles.getStartedText}>
			      {this.state.JobNotes}
                </Text>
                <Button title="CLose Notes" onPress={()=>this.setState({isNotesVisible: false})} />
				</ScrollView>
               </Modal>

			<View style={styles.jobNotesContainer}>
		      <TouchableHighlight onPress={() => this.setState({isNotesVisible: true})}>
				<Text style={styles.getStartedText}>
	          Notes {this.state.JobNotes}
	          </Text>
				  </TouchableHighlight>

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
            </Picker> : <Button style={styles.buttonContainer} title={this.state.event}  onPress={this.resetEventStatus} />
            }
   
            </View>
	

        </View>
			<View style={styles.buttonContainer}>
		      <Text style={styles.getStartedText}>
               Status {this.state.checkinStatus} {this.state.event} and Job# {this.state.Name}
	          </Text>

            </View>
			{this.renderGPS()}     

	
	</View>
    </View>
    );
 }
}
