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
} from 'react-native';
import Constants from 'expo-constants'
import * as LocalAuthentication from 'expo-local-authentication';
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
    isLoading: true,
	auth: null,
  };


  async componentWillMount() {

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


  checkForBiometrics = async (Screen) => {
    let biometricRecords = await LocalAuthentication.isEnrolledAsync();
    if (!biometricRecords) 
	{
			if (this.state.EmpNo)
			{
				await AsyncStorage.setItem('Bio', this.state.EmpNo);
				const auth = await this.authEmpInstApi();
			    const Screen =  await AsyncStorage.getItem('Screen');
				if (auth && auth.authorized != 1)
				{
					this.props.navigation.navigate('Alternative', {onGoBack: () => this.primaryLogin(Screen)});
				}
				else
				{
					  this.props.navigation.navigate('Camera',  {onGoBack: () => this.primaryLogin(Screen)});
				}
			}
	
			else
			{
				if (this.state.auth && this.state.auth.EmpActive == 1 && this.state.auth.Screen != Screen && Screen != 'Document')
		     {
					 Alert.alert('You are logged into ' + this.state.auth.Screen + ' Portal');
		     }
				else
				{
					  this.props.navigation.navigate('Camera',  {onGoBack: () => this.primaryLogin(Screen)});
				}	
			}
        

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
    let result = await LocalAuthentication.authenticateAsync('Biometric Scan.');
    if (result.success) {

		if (this.state.EmpNo == null)
        { 
        }
		else
		{
	
		    await AsyncStorage.setItem('Bio', this.state.EmpNo);
			const auth = await this.authEmpInstApi();
		    const Screen =  await AsyncStorage.getItem('Screen');
			if (auth && auth.authorized != 1)
			{
				this.props.navigation.navigate('Alternative', {onGoBack: () => this.primaryLogin(Screen)});
			}
			else
			{
				if (this.state.auth.EmpActive == 1 && this.state.auth.Screen != Screen && Screen != 'Document')
		     {
					 Alert.alert('You are logged into ' + this.state.auth.Screen + ' Portal');
		     }
				else
				{
					this.props.navigation.navigate(Screen);
				}	
			}
        }

    } else {
	    this.props.navigation.navigate('Camera',  {onGoBack: () => this.primaryLogin(Screen)});
	}
  };

async authEmpInstApi() {

 
 	const netStatus = await NetInfo.getConnectionInfo()  
	console.log(netStatus);
	if (netStatus.type == 'none')
	{
		return false;
	}
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
	  
     return this.state.auth;	
}
 
 

alternateLogin = async (newscreen) => {

	  const auth = await this.authEmpInstApi();

      if (this.state.auth.EmpActive == 1 && this.state.auth.Screen != newscreen)
      {
		 Alert.alert('You are logged into ' + this.state.auth.Screen + ' Portal');
      }
	  else
	  {
		AsyncStorage.setItem('Screen', newscreen);
	  }
     this.props.navigation.navigate('Camera');

}

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
 
	if (newscreen == 'Document')
	{
		this.props.navigation.navigate(newscreen);
	}
	else
	{
		await AsyncStorage.setItem('Screen', newscreen);

	
		if (this.state.compatible)
		{
	     this.checkForBiometrics(newscreen);
		}
		else
		{
	    this.props.navigation.navigate('Camera');
		}
	}
	
}		

renderPortal = (newscreen) => {

  portal = '';
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
	  {this.renderPortal('Job')}
	  {this.renderPortal('Dispatch')}
	  {this.renderPortal('Employee')}
	  {this.renderPortal('Document')}
	  {__DEV__ ? <Button title="Reset" onPress={this.resetKeys} /> : null}

      </View>

			  );
  }
}


