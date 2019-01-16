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

  checkForBiometrics = async () => {
    let biometricRecords = await Expo.LocalAuthentication.isEnrolledAsync();
    if (!biometricRecords) {
      Alert.alert('No Biometrics Found',
        'Please ensure you have set up biometrics in your OS settings.'
      );
    } else {
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
            const Name = await AsyncStorage.getItem('Name');
			if (Name != null)
			{
				this.props.navigation.navigate('Start');
			}
			else
			{
				this.props.navigation.navigate('Start');
            }
        }

    } else {
	    this.buttonClickListener;
	}
  };

 
 buttonClickListener = () =>{


  this.props.navigation.navigate('Camera');
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

			<Text> Device: {Constants.installationId} </Text>
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
			  onPress={this.buttonClickListener}
			  />
		  </View>


			  </View>
	  {__DEV__ ? <Button title="Reset" onPress={this.resetKeys} /> : null}

      </View>

			  );
  }
}


