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
		noteAdded: false,
        Add1: '',
		Add2: '',
		City: '',
		State: '',
		Zip: '',
		Phone1: '',
		addDispatchNote: '',
		addDispatchPicture: false,
		pictures: null,
		isVisibleDispatchNote: false,
		notes: '',
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
		   let title = this.state.dispatchs[i].Dispatch + ' ' + this.state.dispatchs[i].DispatchName;
	      pickers.push(<Button key={this.state.dispatchs[i].Dispatch} title = {title} value={i} onPress={()=>this.updateDispatch(i)} />);
       }
	   pickers.push(<Button key="close" title="Back" onPress={()=>this.setState({isDispatchVisible: false})} />);
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

    this.setState({isLoading: true});

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
		 this.fetchDispatchsFromApi();	  
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

	
    this.setState({isLoading: true});

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
		 //console.log(location);
		 this.setState({latitude: location.coords.latitude, longitude: location.coords.longitude});
		 
	  }
}
async componentWillMount () {
	
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
	  const notes = await AsyncStorage.getItem('notes');
	  const noteadded = await AsyncStorage.getItem('noteadded');
	  if (noteadded)
	  {
		  this.setState({noteAdded: true});
	  }
	  this.loadPictures();
		console.log('image check');
		console.log(image);
	  this.setState({violation: violation, image: image, notes: notes});

	  this._getLocationAsync();
	  await this.authEmpInstApi();

	  if (!this.state.locationstatus)
	  {
		 let location = await Location.getCurrentPositionAsync({});
		 console.log(location);
		 this.setState({latitude: location.coords.latitude, longitude: location.coords.longitude});
		 
	  }
	  console.log('componentDidMount');
	  console.log(this.state.image);
	  if (!this.state.image)
	  {
	      this.intervalID = setInterval(this.gps_update, 5000);

	  }



}

async setItem(key, value) {
    try {
        return await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
         console.error('AsyncStorage#setItem error: ' + error.message);
    }
}

async getItem(key) {
    return await AsyncStorage.getItem(key)
        .then((result) => {
            if (result) {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                     console.error('AsyncStorage#getItem error deserializing JSON for key: ' + key, e.message);
                }
            }
            return result;
        });
}
async removeItem(key) {
    return await AsyncStorage.removeItem(key);
}


async componentDidMount ()  {


}

error(err) {
  Alert.alert('ERROR(' + err.code + '): ' + err.message);
}

 componentWillUnmount() {

    clearInterval(this.intervalID);
  }

 async checkStatus(override) {
	 if (this.state.image)
	 {
		 override = true;
	 }
	if (override)
	{
		this.setState({override: override});
	}
	if (this.state.checkinStatus == 'Start' && !this.state.dispatchstatus && !this.state.eventstatus && (this.state.event=='Traveling' || override || (this.state.event=='Working' && (this.state.dispatchdistance != null && this.state.dispatchdistance < 2)))) {
		await this.authEventLogApi();
		if (this.state.event=='Working')
		{
		    clearInterval(this.intervalID);
		}
		if (this.state.auth.EmpActive == '1')
		{
			this.setState({checkinStatus: 'Stop', active: !this.state.active});
			return false;
		}
	}
	else if (this.state.checkinStatus == 'Stop' && !this.state.dispatchstatus && !this.state.eventstatus) {
		if (this.state.notes)
			{
				this.setState({addDispatchNote: this.state.notes});
				await this.addDispatchNote();
			}
		await this.authEventLogApi();
		if (this.state.auth.EmpActive != '1')
		{
	
			if (this.state.pictures && this.state.pictures.length != 0)
			{
				await this.uploadImages();
			}

			this.setState({checkinStatus: 'Start', active: !this.state.active});
			this.props.navigation.navigate('Home');
			Alert.alert('Dispatch Work Done');
			return false;
		}
	}
	else
	 {
		if (this.state.checkinStatus == 'Start' && this.state.event== 'Working' && ((this.state.dispatchdistance == null || this.state.dispatchdistance > 2) && !this.state.image))
		{
			Alert.alert('Not within range of ' + this.state.DispatchLocation + ' or gps not valid ' + this.state.dispatchdistance); 
		    clearInterval(this.intervalID);
			this.props.navigation.navigate('Picture', {onGoBack: () => this.checkStatus(true), Screen: 'DispatchOverride', address: this.state.DispatchLocation, reference: this.state.Dispatch, LocName: this.state.DispatchLocation});
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

		//console.log(this.state.dispatchs[i]);
		this.setState({ Dispatch: this.state.dispatchs[i].Dispatch, Counter: this.state.dispatchs[i].Counter, dispatchstatus: !this.state.dispatchstatus,  DispatchName: this.state.dispatchs[i].DispatchName, DispatchLocation: this.state.dispatchs[i].location, DispatchNotes: this.state.dispatchs[i].DispatchNotes, Add1: this.state.dispatchs[i].Add1, Add2: this.state.dispatchs[i].Add2, City: this.state.dispatchs[i].City, State: this.state.dispatchs[i].State, Zip: this.state.dispatchs[i].Zip, Phone1: this.state.dispatchs[i].Phone1, dispatchdistance: this.state.dispatchs[i].distance, dispatchlatitude: this.state.dispatchs[i].latitude, dispatchlongitude: this.state.dispatchs[i].longitude, isDispatchVisible: false })
	    //console.log(this.state);
   }

renderAddress = () => {


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
	//console.log(auth);
	this.setState({checkinStatus: 'Stop'});

	

}

renderMaybeWorking = () => {
	


	if (this.state.event != 'Traveling')
	{
		return false;
	}
	if (this.state.checkinStatus != 'Stop')
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


}

renderWorking = () => {

	if (this.state.event != 'Working')
	{
		return false;
	}
	return(
		<View style={styles.buttonContainer}>

			<Button title="Add Picture" onPress={this.dispatchCamera}  />
		</View>	
   );

}

async loadPictures () {

		pictures = await this.getItem('pictures');

		if (pictures && pictures.length > 0)
		{
			this.setState({pictures: pictures});
			this.setState({addDispatchPicture: true});
		}

return true;
}



dispatchCamera = () => {

	this.props.navigation.navigate('Picture', {onGoBack: () => this.loadPictures() , LocName: this.state.DispatchName, address: 'DispatchCamera', reference: this.state.Dispatch});

}

customerComplete = () => {



	this.props.navigation.navigate('DispatchComplete');
}

renderCustomerComplete = () => {

	//console.log(this.state.isLoading);

	//console.log(this.state.event);
	//console.log(this.state.checkinStatus);

	if (this.state.event != 'Working' || this.state.checkinStatus != 'Stop')
	{
		return false;
	}
	//console.log(this.state.dispatchdistance);
	//console.log(this.state.override);
	if (!this.state.image && !this.state.override && !this.state.pictures)
	{
		return (<View style={styles.noteboxContainer}><Text>Picture Needed</Text></View>);
	}
	if (this.state.noteAdded == false)
	{
			return(
		<View style={styles.noteboxContainer}>
			<Text>Note Needed to Complete Dispatch</Text>
		</View>);
	}
	if (this.state.dispatchdistance != null &&  this.state.dispatchdistance > 2 && this.state.override==false)
	{
	//console.log('render distance');
		return(
		<View style={styles.noteboxContainer}>
			<Text>Distance {this.state.dispatchdistance}</Text>
		</View>);
		
	}
	//console.log('renderCustomerComplete');
	return(
		<View style={styles.buttonContainer}>
<Button title="Complete Job" onPress={this.customerComplete}  />
		</View>	
   );
}

visiableAddDispatchNote = () => {

	this.setState({isVisibleDispatchNote: true});
}

addToNote = async () => {

//console.log(this.state.addDispatchNote);
let thisnote = await AsyncStorage.getItem('notes');

if (thisnote)
{
	thisnote = thisnote.concat(' ', this.state.addDispatchNote);
}
else
{
	thisnote = this.state.addDispatchNote;
}
//console.log(thisnote);
//console.log(this.state.addDispatchNote);

if (thisnote)
{
	this.setState({addDispatchNote: '', notes: thisnote, isVisibleDispatchNote: false, isNotesVisible: false});
	await AsyncStorage.setItem('notes', thisnote);
	await AsyncStorage.setItem('noteadded', 'addDispatchNote');
}



return thisnote;
}


 uploadImages = async ()  => {

	if (!this.state.pictures || this.state.pictures.length == 0)
	{
		return false;
	}
   let max = this.state.pictures.length;
   for(let i = 1; i <= max; i++) {
  
   row = this.state.pictures.pop();
   await this.setItem('pictures', this.state.pictures);
   this.setState({pictures: this.state.pictures});
   await uploadImageAsync(row);

   }
   Alert.alert('Images Uploaded ');

}

addDispatchNote = async () => {

	console.log('checking for notes');
	if (this.state.addDispatchNote == '' || this.state.checkinStatus != 'Stop')
	{
		//console.log(this.state.data);
		this.setState({isVisibleDispatchNote: false});
		return false;
	}
	console.log('Add Dispatch Note');
	this.setState({checkinStatus: 'addNote'});
	console.log(this.state.addDispatchNote);
	const post = await this.authEventLogApi();
	await AsyncStorage.removeItem('notes');
	//console.log(post);
	this.setState({checkinStatus: 'Stop', DispatchNotes: post.DispatchNotes, isVisibleDispatchNote: false});
	this.setState({isVisibleDispatchNote: false});
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

		   <Button key="Close" title="Back"

          onPress={() => this.addToNote} value="Close"

          style={styles.buttonContainer} />
		        </ScrollView>
               </Modal>

        </View>
   )
}
renderDispatchModal = ()  => {

    if (this.state.dispatchs == null)
    {
		return false;
    }
	return (
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
	  );
}
 render() {

	if (this.state.latitude == null)
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
	 {this.renderDispatchModal()}
	 {this.renderAddress()}
            <Modal animationType = {"slide"} transparent = {true}
                   visible = {this.state.isNotesVisible}
                   onRequestClose = {() =>{ console.log("Modal has been closed.") } }>
   
  		        <ScrollView style={styles.buttonContainer}>
				<View style={styles.noteboxContainer}>
		  		                  <Button title="Add To Notes" onPress={()=>this.addToNote()} />
                <Button title="Back" onPress={()=>this.setState({isNotesVisible: false})} />
</View>

				<TextInput  multiline={true}     numberOfLines={4}
        style={styles.noteContainer}
                  onChangeText={data => this.setState({ addDispatchNote: data })}
      />

				<Text style={styles.noteText}>
			      {this.state.DispatchNotes}
		  	 {this.state.notes}

                </Text>
	
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
				   <Button title="Back" onPress={()=>this.setState({isEventVisible: false})} />
				</View>
			   </ScrollView>
      </Modal>
		{
    	    this.state.eventstatus? <Button title={this.state.event} onPress = {() => this.setState({isEventVisible: true})} /> : <Button style={styles.buttonContainer} title={this.state.event}  onPress={this.resetEventStatus} /> 
         }
		</View>

      	   
			<View style={styles.buttonContainer}>

	
	 {this.renderMaybeWorking()}
	 {this.renderWorking()}
	 {this.renderCustomerComplete()}
	 {this.renderWorkingDispatchNotes()}

            </View>
	   

	
	</View>
    </View>
    );
 }
}


async function uploadImageAsync(row) {

  let apiUrl = URL + `upload/index.php`;




  let uriParts = row.image.split('.');

  let fileType = uriParts[uriParts.length - 1];


  let formData = new FormData();

  formData.append('photo', {

    uri: row.image,

    name: `${row.key}.${row.EmpNo}.${row.Screen}.${row.reference}.${row.LocName}.${row.violation}.${row.latitude}.${row.longitude}.${fileType}`,

    type: `multipart/form-data`,

  });


  opt = {

    method: 'POST',

    body: formData,

    headers: new Headers({
        'Accept': 'application/json',
		'Content-Type': 'multipart/form-data; boundary=someArbitraryUniqueString'

    }),

  };
//console.log(apiUrl);
//console.log(opt);


  return fetch(apiUrl, opt);

}
