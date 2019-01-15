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

        Name: '',
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
        jobs: null,
        job: null,
		jobstatus: true,
        pickers: null,
        auth: null,
		timer: null,
        violation: null,
	    image: null
    }

}

async fetchJobsFromApi() {

 
	await fetch(URL + 'jobs_json.php')
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
	    pickers.push(<Picker.Item key={i} label = {this.state.jobs[i].LocName} value={i} />);
     }
	//console.log(pickers);
	this.setState({pickers: pickers});
	
}


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
		  this.setState({Name: this.state.auth.Name, LocName: this.state.auth.LocName, JobNotes: this.state.auth.JobNotes, event : this.state.auth.event, eventstatus: false, jobstatus: false, checkinStatus: 'Stop', active: false}) 
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

async componentDidMount () {

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

  
}

 componentWillUnmount() {

    navigator.geolocation.clearWatch(this.watchId);
    clearInterval();
  }

 async checkStatus() {
	
	if (this.state.checkinStatus == 'Start' && !this.state.jobstatus && !this.state.eventstatus) {
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
			this.updateEvent();
			this.updateJobStatus();

		}


	}

	//console.log(this.state);

}

  updateEvent = (event) => {

	   this.setState({ event: event, eventstatus: !this.state.eventstatus })

   }
 updateJobStatus = () => {

	   this.setState({job: null, jobstatus: !this.state.jobstatus, Name: null, LocName: null, JobNotes: null})
   
  
  }
 updateJob = (job) => {
	  if (job != '')
	  {
	      this.setState({ job: job, jobstatus: !this.state.jobstatus, Name: this.state.jobs[job].Name, LocName: this.state.jobs[job].LocName, JobNotes: this.state.jobs[job].JobNotes })
	  }
   }
buttonDone = () => {

	this.props.navigation.navigate('Home');
}


 render() {


	
	return (

	<View style={styles.container}>
    <View style={styles.welcomeContainer}>
			<View style={styles.buttonContainer}>
 	        <View>
	        {
            this.state.jobstatus ? <Picker selectedValue = {this.state.job} onValueChange = {this.updateJob}>
			   <Picker.Item label = "Select Job" value = "" />
				{this.state.pickers}

			</Picker> : <Text style={styles.getStartedText}>{this.state.LocName}</Text>
            }
			   </View>
            
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