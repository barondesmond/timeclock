import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Alert,
  Navigation,
  AsyncStorage,
  NetInfo,
  Geolocation,

} from 'react-native';
import Constants from 'expo-constants'
import * as LocalAuthentication from 'expo-local-authentication';
import { MonoText } from '../components/StyledText';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import * as lib from '../components/lib';
import styles from '../components/styles';

import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, AUTHKEY} from '../constants/common';




export default class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null
 
	};

  state = {
    compatible: false,
    EmpNo: null,
    Bio: null,
    uids: null,
    isLoading: true,
	auth: null,
	locationstatus: null,
	latitude: null,
	longitude: null,
	EmpActive: null,
	change: 'HS11222019',
	auth: null,
	dispatchs: null,
	jobs: null,
  };

	async componentWillUnMount() {
	
	lib.fetch_cancel();

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
}

  async componentWillMount() {


	  await this._getLocationAsync().catch((error) => { console.log(error)});
	  if (!this.state.locationstatus)
	  {
	
		 var location = await Location.watchPositionAsync({}, this.gps_update).catch((error) => { console.log(error)});
		 console.log(location);

		 
	  }


	const EmpNo = await AsyncStorage.getItem('EmpNo');


	if (EmpNo === null)
	{

		  this.props.navigation.navigate('Alternate');
		  
	}
	else
	{
		this.setState({EmpNo: EmpNo});
		await AsyncStorage.removeItem('Bio');
		await AsyncStorage.removeItem('violation');
		await AsyncStorage.removeItem('image');



	}


	this.checkDeviceForHardware();

		if (this.state.latitude && this.state.longitude && this.state.EmpNo && URL != '')
		{
		  auth = await lib.fetch_authemp(URL + `authempinst_json.php?EmpNo=${this.state.EmpNo}&installationId=${Constants.installationId}&version=${Constants.manifest.version}&latitude=${this.state.latitude}&longitude=${this.state.longitude}&dev=${__DEV__}&change=${this.state.change}`);
		  console.log(auth);
		  if (auth && auth.authorized == 1)
		  {
			  await this.setState({auth: auth});
		  }
		  if (auth && auth.authorized == 0)
		  {
			  this.props.navigation.navigate('Alternate');

		  }
		}

  }

 

  checkDeviceForHardware = async () => {
    let compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      this.showIncompatibleAlert();
    }
	else
	 {
	    this.setState({ compatible });
	 }

  };

 showIncompatibleAlert = () => {
    Alert.alert('Incompatible Device',
      'Current device does not have the necessary hardware to use this API.'
    );
  };

_getLocationAsync = async () => {

	let { status } = await Permissions.askAsync(Permissions.LOCATION);
	if (status !== 'granted') 
	{
	   Alert.alert('Location services required ' + status);
	   this.setState({locationstatus: status});
	}

}

  checkForBiometrics = async (newscreen) => {
	  console.log('checkforbiometrics');
    let biometricRecords = await LocalAuthentication.isEnrolledAsync();
	console.log('checkbiometrics complete');
    if (!biometricRecords) 
	{
		this.props.navigation.navigate('Camera',  {onGoBack: () => this.primaryLogin(newscreen)});

    } else {
      this.handleLoginPress(newscreen);
    }
  };
  
  handleLoginPress = (newscreen) => {
    if (Platform.OS === 'android') {
      this.showAndroidAlert(newscreen);
    } else {
		 this.scanBiometrics(newscreen);
    }
  };

  showAndroidAlert = (newscreen) => {
    Alert.alert('Fingerprint Scan', 'Place your finger over the touch sensor.', [], {cancelable: true});
    this.scanBiometrics(newscreen);
  };

  checkAuth = async (newscreen) => {
  
		EmpNo = await AsyncStorage.getItem('EmpNo');
		if (EmpNo)
		{
			await this.setState({EmpNo: EmpNo});
		}
		console.log(EmpNo);
		console.log(this.state.EmpNo);
		if (this.state.EmpNo === null)
        {
			await this.props.navigation.navigate('Alternative', {onGoBack: () => this.primaryLogin(this.state.Screen)});
			return false;

        }

 	
			auth = await lib.fetch_authemp(URL + `authempinst_json.php?EmpNo=${this.state.EmpNo}&installationId=${Constants.installationId}&version=${Constants.manifest.version}&latitude=${this.state.latitude}&longitude=${this.state.longitude}&dev=${__DEV__}&change=${this.state.change}`);
			if (auth)
			{
				await this.setState({auth: auth});
			}
			if (auth && auth.authorized == 0)
			{
				this.props.navigation.navigate('Alternative', {onGoBack: () => this.primaryLogin(newscreen)});
				return false;
			}


	console.log(auth);
	console.log(this.state.auth);
	return auth;
  }


  scanBiometrics = async (newscreen) => {
	 console.log('scanbiometrics');
    let result =  await LocalAuthentication.authenticateAsync('Biometric Scan.');
	console.log('scanbiometrics complete');
    if (result.success) {
		this.props.navigation.navigate(newscreen);
		return false;
	} else {
	    this.props.navigation.navigate('Camera',  {onGoBack: () => this.primaryLogin(newscreen)});
		return false;
	}
  };

 

resetKeys = async ()  => {
 
 await AsyncStorage.removeItem('Name');
 await AsyncStorage.removeItem('Email');
 await AsyncStorage.removeItem('EmpNo');
 await AsyncStorage.removeItem('Bio');
 await AsyncStorage.removeItem('Screen');

 this.props.navigation.navigate('Alternative', {onGoBack: () => this.primaryLogin(this.state.Screen)});
}

primaryLogin = async (newscreen) => {

	if (!newscreen)
	{
		return false;
	}
	if (!this.state.latitude || !this.state.longitude)
	{
		return false;
	}
	console.log('check auth');
	auth = await this.checkAuth(newscreen);
	console.log('complete checkauth');
	if (newscreen == 'Document')
	{
		this.props.navigation.navigate(newscreen);
	}
	else if (auth && auth.authorized == 1)

	{
	   if (auth.EmpActive == 1 && auth.Screen != newscreen && newscreen != 'Employee')
      {
		 Alert.alert('You are logged into ' + auth.Screen + ' Portal');
		 return false;
      }
	  else
	  {
		AsyncStorage.setItem('Screen', newscreen);
	  }
	console.log(this.state.compatible);
		if (this.state.compatible)
		{
	     this.checkForBiometrics(newscreen);
		}
		else
		{
		  this.props.navigation.navigate('Camera',  {onGoBack: () => this.primaryLogin(newscreen)});
		}
	}
	
}		

renderPortal = (newscreen) => {

  let portal = '';
  if (newscreen != 'Document')
  {
	  portal = newscreen + " Login";

  }
  else
	{
	  portal = newscreen + " Scanner";
	}

return(
<View>
        <View style={styles.getPortalContainer}>
            <Text style={styles.getStartedText}>
	{newscreen} Portal
            </Text>
          </View>


			  <View style={styles.contentContainer}>
          <View style={styles.buttonContainer}>

			  <Button title={portal} onPress={() => this.primaryLogin(newscreen)} />
			  </View>
          </View>

</View>
    )
};



renderDevice = () => {

if (!__DEV__)
{
	return false;
}

if (this.state.auth)
{
	console.log(this.state.auth);
}


return (	  <View style={styles.welcomeContainer}>
			<Text> User: {this.state.EmpNo} </Text><Text> Device: {Constants.installationId} </Text>
          </View>);
}

render() 
  {

    return (
      <View style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/serviq.png')
                  : require('../assets/images/serviq.png')
              }
              style={styles.welcomeImage}
            />
          </View>
	  
      {this.renderDevice()}

	  {this.renderPortal('Employee')}
	  {this.renderPortal('Document')}
	  {__DEV__ ? <Button title="Logout" onPress={this.resetKeys} /> : <Button title="Logout" onPress={this.resetKeys} />}

      </View>

			  );
  }
}


