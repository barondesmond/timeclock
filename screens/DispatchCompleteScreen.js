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
import Expo, { Constants, Location, Permissions, ScreenOrientation } from 'expo';

import styles from '../components/styles';
import * as lib from '../components/lib';


import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';




export default class DispatchCompleteScreen extends Component {

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
        isDispatchVisible: false,
		isEventVisible: false,
		isNotesVisible: false,
        Add1: '',
		Add2: '',
		City: '',
		State: '',
		Zip: '',
		Phone1: '',
		addDispatchNote: '',
		notes: null,
		customer : false,
		customerimage: null,
		isVisibleDispatchNote: false,    
		isLoadingEvent: true,
		isLoading: true,
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
		this.setState({pickers: pickers});

	 }
	
}


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
		  if (this.state.auth.Screen != 'Dispatch')
		  {
			  this.props.navigation.navigate(this.state.auth.Screen);
		  }
		  this.setState({Dispatch: this.state.auth.Dispatch, DispatchName: this.state.auth.DispatchName, DispatchNotes: this.state.auth.DispatchNotes, Add1: this.state.auth.Add1, Add2: this.state.auth.Add2, City: this.state.auth.City, State: this.state.auth.State, Zip: this.state.auth.Zip, Phone1: this.state.auth.Phone1,event : this.state.auth.event, eventstatus: false, dispatchstatus: false, checkinStatus: 'Stop', active: false, isDispatchVisible: false}) 
	  }
	  
	  
     return this.state.auth;	
}

async authEventLogApi() {

	
	if (__DEV__ && this.state.latitude == null)
	{
		this.setState({latitude: '33.3333', longitude: '-88.9888'});
	}
	Screen = await AsyncStorage.getItem('Screen');
	let authurl = URL + `authempinst_json.php?EmpNo=${this.state.EmpNo}&installationId=${Constants.installationId}&event=${this.state.event}&Dispatch=${this.state.Dispatch}&checkinStatus=${this.state.checkinStatus}&Bio=${this.state.Bio}&violation=${this.state.violation}&image=${this.state.image}&latitude=${this.state.latitude}&longitude=${this.state.longitude}&Screen=${Screen}&addDispatchNote=${this.state.addDispatchNote}&customer=${this.state.customer}&customerimage=${this.state.customerimage}&Complete=Y&dev=${__DEV__}`;
	  await fetch(authurl)
      .then((response2) => response2.json())
      .then((responseJson2) => {

        this.setState({
          isLoadingEvent: false,
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

async componentDidUpdate () {

	console.log(this.state.customer);
	console.log(this.state.customerimage);
	if (this.state.customerimage == null && this.state.customer == false)
	{

	  const customer = await AsyncStorage.getItem('customer');
	  const customerimage = await AsyncStorage.getItem('customerimage');
	  this.setState({customer: customer, customerimage: customerimage, isLoadingEvent: false});

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
	 
	
	  const EmpName = await AsyncStorage.getItem('EmpName');
	  this.setState({EmpName: EmpName});

	  const Email = await AsyncStorage.getItem('Email');
	  this.setState({Email: Email});

	  const EmpNo = await AsyncStorage.getItem('EmpNo');
	  this.setState({EmpNo: EmpNo});

	  const Bio = await AsyncStorage.getItem('Bio');
	  this.setState({Bio: Bio});
	  const customer = await AsyncStorage.getItem('violation');
	  const customerimage = await AsyncStorage.getItem('image');
	  const notes = await AsyncStorage.getItem('notes');

	  if (this.customer && this.customerimage)
	  {
		  this.setState({customer: customer, customerimage: customerimage, violation: customer, image: customerimage});
	  }
	  const auth = await this.authEmpInstApi();
	  if (auth.authorized == 0)
	  {
		  this.props.navigation.navigate('Alternative');
	  }
	  else
	  {
		  if (auth.authorized == 1)
	      {
	          await this.fetchDispatchsFromApi();
		  }
		  else
		  {
			  this.props.navigation.navigate('Alternative');
		  }
	 }
  
}


error(err) {
  Alert.alert('ERROR(' + err.code + '): ' + err.message);
}

 componentWillUnmount() {

	this.setState({isLoadingEvent: true});
	navigator.geolocation.clearWatch(this.watchId);
    clearInterval();
  }

addDispatchNote = async () => {

	const netStatus = await NetInfo.getConnectionInfo()  
	if (netStatus.type == 'none')
	{
		Alert.alert('no connection');

		return false;
	}
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

checkStatus =  async () => {

	
	 console.log(this.state.checkinStatus);
	 const customer = await AsyncStorage.getItem('violation');
	 const customerimage = await AsyncStorage.getItem('image');
	 console.log(customer);
	 if (this.state.checkinStatus == 'Stop' && !this.state.dispatchstatus && !this.state.eventstatus && customer != ''  && customerimage != '') {
		this.setState({customer: customer, customerimage: customerimage});
		await this.authEventLogApi();
		if (this.state.auth.EmpActive != '1')
		{
			await AsyncStorage.removeItem('noteadded');
			await AsyncStorage.removeItem('override');
			if (this.state.notes)
			{
				this.setState({addDispatchNote: this.state.notes});
				await this.addDispatchNote();
			}
			this.loadPictures();
			this.uploadImages();
			this.setState({checkinStatus: 'Start', active: !this.state.active, customer:false, customerimage:null});
			await AsyncStorage.removeItem('violation');
			await AsyncStorage.removeItem('image');
			Alert.alert('Dispatch Complete');
			this.props.navigation.navigate('Home');
		}


	}

	//console.log(this.state);

}

async loadPictures () {

		pictures = await lib.getItem('pictures');

		if (pictures && pictures.length > 0)
		{
			this.setState({pictures: pictures});
			this.setState({addDispatchPicture: true});
		}

return true;
}

 uploadImages = async ()  => {

	const netStatus = await NetInfo.getConnectionInfo()  
	if (netStatus.type == 'none')
	{
		Alert.alert('no connection');

		return false;
	}
	if (!this.state.pictures || this.state.pictures.length == 0)
	{
		return false;
	}
   let max = this.state.pictures.length;
   for(let i = 1; i <= max; i++) {
  
   row = this.state.pictures.pop();
   await lib.setItem('pictures', this.state.pictures);
   this.setState({pictures: this.state.pictures});
   await lib.uploadImageAsync(row);

   }

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




customerComplete = async () => {

	
	if (this.state.customer != false && this.state.customerimage != null)
	{
		this.checkStatus();
	}
	else
	{
		if (this.state.violation)
		{
			await AsyncStorage.setItem('violation', this.state.violation);
		}
		this.props.navigation.navigate('Signature', {
      onGoBack: () => this.checkStatus(), Screen: 'DispatchSignaure',LocName: this.state.DispatchName, address: 'customerComplete', reference: this.state.Dispatch});
	}
}

renderCustomerComplete = () => {
	
	if (this.state.isLoading==true || this.state.isLoadingEvent==true)
	{
		return false;
	}
	if (this.state.dispatchdistance != null &&  this.state.dispatchdistance > 2 && __DEV__==false)
	{
		return false;
	}
	if (this.state.event != 'Working' || this.state.checkinStatus != 'Stop')
	{
		return false;
	}
	console.log(this.state.customer);
	console.log(this.state.customerimage);
	if (this.state.customer != false && this.state.customerimage != null)
	{
		return (
			<View style={styles.maybeRenderImageContainer}>
			      <TouchableOpacity onPress={this.checkStatus}>
		          <Image source={{ uri: this.state.customerimage }} style={styles.maybeRenderImage} />
			      <Text style={styles.getStartedText}>{this.state.checkinStatus} {this.state.customer}</Text>
			      </TouchableOpacity>
			</View>
			);
	}
    else
	{
	return(
		<View style={styles.buttonContainer}>
	    <TextInput placeholder="Customer" 
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={data => this.setState({ violation: data })}
      />	
<Button title="Customer Accept" onPress={this.customerComplete}  />
		</View>	
   );
	}
}

visiableAddDispatchNote = () => {

	this.setState({isVisibleDispatchNote: true});
}

renderHours = () => {

	if (this.state.isLoading==true || this.state.auth==null)
	{
		return false;
	}
	return (
		<View style={styles.buttonContainer}>
		<Text style={styles.getStartedText}>
		  Traveling Hours: {this.state.auth.Traveling}
		</Text>
			<Text style={styles.getStartedText}>
			Working Hours: {this.state.auth.Working}
			</Text>
		</View>
	);
}

 render() {

	ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);

	
	return (

	<View style={styles.container}>
    <View style={styles.welcomeContainer}>
			<View style={styles.buttonContainer}>
   
	          <Text style={styles.getStartedText}>{this.state.DispatchName} </Text> 
			   
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
	 {this.renderHours()}
	


      	   
			<View style={styles.buttonContainer}>
	
	 {this.renderCustomerComplete()}

            </View>
	   

	
	</View>
    </View>
    );
 }
}

