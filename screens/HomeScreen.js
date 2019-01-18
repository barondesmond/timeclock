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
} from 'react-native';
import { WebBrowser, Constants } from 'expo';

import { MonoText } from '../components/StyledText';



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
    Screen: null,

  };



  async componentDidMount() {


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
		this.setState({Screen: null});
	}
	console.log(this.state);
	this.checkDeviceForHardware();
  }


  checkDeviceForHardware = async () => {
    let compatible = await Expo.LocalAuthentication.hasHardwareAsync();
    this.setState({ compatible });
    if (!compatible) {
      this.showIncompatibleAlert();
    }
  };

 showIncompatibleAlert = () => {
    Alert.alert('Incompatible Device',
      'Current device does not have the necessary hardware to use this API.'
    );
  };

checkForBiometricsDispatch = async () => {
    let biometricRecords = await Expo.LocalAuthentication.isEnrolledAsync();
    if (!biometricRecords) {
      Alert.alert('No Biometrics Found',
        'Please ensure you have set up biometrics in your OS settings.'
      );
    } else {
		this.setState({Screen: 'Dispatch'});
      this.handleLoginPress();
    }
  };


  checkForBiometrics = async () => {
    let biometricRecords = await Expo.LocalAuthentication.isEnrolledAsync();
    if (!biometricRecords) {
      Alert.alert('No Biometrics Found',
        'Please ensure you have set up biometrics in your OS settings.'
      );
    } else {
		this.setState({Screen: 'Job'});
      this.handleLoginPress();
    }
  };
  
  handleLoginPress = () => {
    if (Platform.OS === 'android') {
      this.showAndroidAlert();
    } else {
      this.scanBiometrics();
    }
  };

  showAndroidAlert = () => {
    Alert.alert('Fingerprint Scan', 'Place your finger over the touch sensor.');
    this.scanBiometrics();
  };

  scanBiometrics = async () => {
    let result = await Expo.LocalAuthentication.authenticateAsync('Biometric Scan.');
    if (result.success) {

		if (this.state.EmpNo == null)
        { 
			console.log(this.state);
			this.props.navigation.navigate('Alternative');
        }
		else
		{
		    await AsyncStorage.setItem('Bio', this.state.EmpNo);
			this.props.navigation.navigate(this.state.Screen);
            
        }

    } else {
	    this.buttonClickListener;
	}
  };

 
 buttonJob = () =>{


  this.props.navigation.navigate('Camera', {Screen: 'Job'} );
}

 buttonDispatch = () =>{


  this.props.navigation.navigate('Camera', {Screen: 'Dispatch'} );
}

resetKeys = async ()  => {
 
 await AsyncStorage.removeItem('Name');
 await AsyncStorage.removeItem('LocName');
 await AsyncStorage.removeItem('Email');
 await AsyncStorage.removeItem('EmpNo');
 await AsyncStorage.removeItem('JobNotes');
 await AsyncStorage.removeItem('Bio');

 this.props.navigation.navigate('Alternative');
}

renderJobPortal = () => {

return(
<View>
        <View style={styles.welcomeContainer}>
            <Text style={styles.getStartedText}>
              Job Portal
            </Text>
          </View>


			  <View style={styles.contentContainer}>
          <View style={styles.buttonContainer}>

			  <Button title="Primary Login"
                   onPress={
            this.state.compatible
              ? this.checkForBiometrics
              : this.showIncompatibleAlert
          }
          />
			  </View>
          </View>
		  <View style={styles.contentContainer}>
          <View style={styles.buttonContainer}>

			  <Button title="Alternate Login" 
			  onPress={this.buttonJob}
			  />
		  </View>
         </View>  
</View>
    )
};
renderDispatchPortal = () => {

if (!__DEV__)
{
	return false;
}

	return(
     <View>
     <View style={styles.welcomeContainer}>

            <Text style={styles.getStartedText}>
              Dispatch Portal
            </Text>
     </View>

			  <View style={styles.contentContainer}>
          <View style={styles.buttonContainer}>

			  <Button title="Primary Login"
                   onPress={
            this.state.compatible
              ? this.checkForBiometricsDispatch
              : this.showIncompatibleAlert
          }
          />
			  </View>
          </View>
		  <View style={styles.contentContainer}>
          <View style={styles.buttonContainer}>

			  <Button title="Alternate Login" value="Camera"
			  onPress={this.buttonDispatch}
			  />
		  </View>
            </View>
     </View>
	);
};

renderDevice = () => {

if (!__DEV__)
{
	return false;
}

return (	  <View style={styles.welcomeContainer}>
			<Text> Device: {Constants.installationId} </Text>
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
	  {this.renderJobPortal()}
	  {this.renderDispatchPortal()}
			  
	  {__DEV__ ? <Button title="Reset" onPress={this.resetKeys} /> : null}

      </View>

			  );
  }
}


