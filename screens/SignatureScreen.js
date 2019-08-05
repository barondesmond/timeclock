import Expo from 'expo';

import * as ExpoPixi from 'expo-pixi';

import React, { Component } from 'react';
import * as lib from '../components/lib';

import { Image, Button, Platform, AppState, StyleSheet, Text, View, TouchableOpacity, AsyncStorage } from 'react-native';
import { Constants, ImagePicker, Permissions, Location } from 'expo';



const isAndroid = Platform.OS === 'android';

function uuidv4() {

  //https://stackoverflow.com/a/2117523/4047926

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {

    var r = (Math.random() * 16) | 0,

      v = c == 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);

  });

}



export default class App extends Component {

  state = {

    image: null,
    strokeColor: 0,
    appState: AppState.currentState,
    uploading: false,
    violation: '',
    EmpNo: null,
	pickerResult: null,
	latitude: null,
	longitude: null,
	locationstatus: false,
    reference: null,
    Screen: null,
	timestamp: null,
	LocName: '',

  };

 


  handleAppStateChangeAsync = nextAppState => {

    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {

      if (isAndroid && this.sketch) {

        this.setState({ appState: nextAppState, id: uuidv4(), lines: this.sketch.lines });

        return;

      }

    }

    this.setState({ appState: nextAppState });

  };

_getLocationAsync = async () => {

	let { status } = await Permissions.askAsync(Permissions.LOCATION);
	if (status !== 'granted') 
	{
	   this.setState({locationstatus: status});
	}

}


 async componentDidMount() {

    AppState.addEventListener('change', this.handleAppStateChangeAsync);

	  this._getLocationAsync();
	  if (!this.state.locationstatus)
	  {
		 let location = await Location.getCurrentPositionAsync({});
		 console.log(location);
		 this.setState({latitude: location.coords.latitude, longitude: location.coords.longitude});
	  }

	if (this.props.navigation.state.params)
	{
		this.setState({address: this.props.navigation.state.params.address});
		this.setState({LocName: this.props.navigation.state.params.LocName});
		this.setState({Screen: this.props.navigation.state.params.Screen});
		this.setState({reference: this.props.navigation.state.params.reference});

	}
	  const EmpNo = await AsyncStorage.getItem('EmpNo');

	  this.setState({EmpNo: EmpNo});
	  if (!this.state.EmpNo || this.state.EmpNo == null)
	  {

		  this.props.navigation.navigate('Alternative');
	  }
	if (!this.state.pictures)
	{
		pics = await AsyncStorage.getItem('pictures');
		if (!pics || pics.length <=0)
		{
			await AsyncStorage.removeItem('pictures');
		}
		else
		{
			pictures = JSON.parse(pics);
			this.setState({pictures: pictures});
			console.log(pictures);
		}
	}


  }



  componentWillUnmount() {

    AppState.removeEventListener('change', this.handleAppStateChangeAsync);

  }



  onReady = () => {

    console.log('ready!');

  };

  clearCanvas = () => {
    this.refs.signatureCanvas.clear()
  }
  saveCanvas = async () => {
    const signature_result = await
    this.sketch.takeSnapshotAsync({
      format: 'jpeg', // 'png' also supported
      quality: 0.5, // quality 0 for very poor 1 for very good
      result: 'file' // 
    })
		this.setState({image: signature_result.uri});
		console.log(signature_result);
		await this.saveSignature();
 
  }

saveSignature = async () => {


   let timestamps = Date();
    
   let picture = {key: timestamps, EmpNo: this.state.EmpNo, Screen: this.state.Screen , reference: this.state.reference, image: this.state.image, violation: this.state.violation, address: this.state.address, latitude: this.state.latitude, longitude: this.state.longitude}; 
   if (this.state.Screen == 'Camera')
   {
	   await AsyncStorage.setItem('violation', this.state.violation);
   }
   if (this.state.Screen != 'Document')
   {
	   await AsyncStorage.setItem('image', this.state.image);
	}

   let pictures = await lib.getItem('pictures');
   console.log('pictures');
   console.log(pictures);
   console.log('savePicture');
   if (pictures && pictures.length > 0)
   {
	   pictures.push(picture);
	   console.log('else');
	   console.log(pictures);
   }
   else
	{
	   lib.removeItem('pictures');

	   pictures = [];
	   pictures.push(picture);
	   console.log('else');
	   console.log(pictures);

    }

   await lib.setItem('pictures', pictures)
   this.props.navigation.state.params.onGoBack();
   this.props.navigation.goBack();

};

  render() {

    return (

      <View style={styles.container}>

        <View style={styles.container}>

          <View style={styles.sketchContainer}>

            <ExpoPixi.Signature

              ref={ref => (this.sketch = ref)}

              style={styles.sketch}

              strokeColor={'blue'}

              strokeAlpha={1}

              onReady={this.onReady}

            />

          </View>

        </View>

      <TouchableOpacity onPress={this.saveCanvas}>
        <Text>Sign</Text>
      </TouchableOpacity>

      </View>

    );

  }

}



const styles = StyleSheet.create({

  container: {

    flex: 1,

  },

  sketch: {

    flex: 1,

  },

  sketchContainer: {

    height: '100%',

  },

  image: {

    flex: 1,

  },

  label: {

    width: '100%',

    padding: 5,

    alignItems: 'center',

  },

  button: {

    // position: 'absolute',

    // bottom: 8,

    // left: 8,

    zIndex: 1,

    padding: 12,

    minWidth: 56,

    minHeight: 48,

  },

});