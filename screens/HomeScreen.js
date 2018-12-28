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
  Navigator
} from 'react-native';
import { WebBrowser, Constants } from 'expo';

import { MonoText } from '../components/StyledText';

import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';



export default class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null
 
	};

  state = {
    compatible: false,
  };

  componentDidMount() {
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
		Alert.alert('Success', 'Successful Authentication');

    } else {
	    this.buttonClickListener;
	}
  };

 
 buttonClickListener = () =>{


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

      </View>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  contentContainer: {
    padding: 5,
    color: '#fff',
   borderColor: 'gray',
	borderWidth: 2,

  },
   buttonContainer: {
    margin: 5,
    color: '#fff',
	backgroundColor: '#DDDDDD',

	},
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
 
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
