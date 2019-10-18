import React, { Component } from 'react';

import {

  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  AsyncStorage,
  Alert,
  Geolocation,
  ScrollView,
  NetInfo,


} from 'react-native';

import { Constants, ImagePicker, Permissions, Location } from 'expo';

import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';
import * as lib from '../components/lib';
import styles from '../components/styles';


export default class CameraScreen extends Component {

  state = {

    image: null,
    uploading: false,
    violation: '',
    EmpNo: null,
	pickerResult: null,
	latitude: null,
	longitude: null,
	locationstatus: false,
    reference: '',
	address: '',
    Screen: null,
	timestamp: null,
	LocName: '',
  };






  render() {

 


     return (

      <ScrollView style={styles.container}>
	<View style={styles.welcomeContainer}>

        <StatusBar barStyle="default" />
	  {this.renderTakePicture()}	
	  {this._maybeRenderImage()}
	  {this.renderUpload()}
	  {this.renderList()}
      </View>
    </ScrollView>

    );

  }

renderTakePicture = () => {


	return (<View>
        <Button onPress={this._takePhoto} title="Take a Picture" />
	</View>);


}

renderUpload = () => {

if (this.state.pictures && this.state.pictures.length > 0 && !this.state.image)
{
return (<View><Button onPress={this.uploadImages} title="Upload" /></View>);

}

}



_getLocationAsync = async () => {

	let { status } = await Permissions.askAsync(Permissions.LOCATION);
	if (status !== 'granted') 
	{
	   this.setState({locationstatus: status});
	}

}




  _maybeRenderUploadingOverlay = () => {

    if (this.state.uploading) {

      return (

        <View

          style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>

          <ActivityIndicator color="#fff" size="large" />

        </View>

      );

    }

  };

renderList = () => {

	 if (this.state.loadingPictures == true)
	 {

		 return false;
	 }
	 if (!this.state.pictures || this.state.pictures.length <= 0)
	 {
		 return false;
	 }
	 if (this.state.image)
	 {
		 return false;
	 }
	return (this.state.pictures.map((row)=>(<Image key={row.key} source={{ uri: row.image }} style={styles.maybeRenderImage} /> ) ));
  }




  _maybeRenderImage = () => {

    let {

      image

    } = this.state;



    if (!image) {

      return;

    }


    return (

      <View

        style={styles.maybeRenderContainer}>

		<Text>Note</Text>
		    <TextInput placeholder="violation" 
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={data => this.setState({ violation: data })}
      />

        <View

          style={styles.maybeRenderImageContainer}>
		  
          <Image source={{ uri: image }} style={styles.maybeRenderImage} />

        </View>

	

  
   <Button title="Save"

          onPress={this.savePicture}

          style={styles.maybeRenderImageText} />
      </View>
 

    );

  };




savePicture = async () => {


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
	   await lib.removeItem('pictures');

	   pictures = [];
	   pictures.push(picture);
	   console.log('else');
	   console.log(pictures);

    }
	 await lib.setItem('pictures', pictures);

	if (this.state.image  && (this.state.Screen == 'DispatchOverride' || this.state.Screen == 'JobOverride' || this.state.Screen == 'EmployeeOverride' || this.state.Screen == 'Document') )
	{
	

	    this.props.navigation.state.params.onGoBack();
		this.props.navigation.goBack();
	}
	else
	{
		this.setState({image: null, pictures: pictures});
	}	

};

async componentDidMount () {


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
		console.log(this.state);

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

	if (!this.state.image && (this.state.Screen == 'DispatchOverride' || this.state.Screen == 'JobOverride' || this.state.Screen == 'EmployeeOverride' || this.state.Screen == 'Document') )
	{
		console.log('take a picture');
		this._takePhoto();
	}
	if (this.state.image  && (this.state.Screen == 'DispatchOverride' || this.state.Screen == 'JobOverride' || this.state.Screen == 'EmployeeOverride' || this.state.Screen == 'Document') )
	{
		console.log('picture taken');
		this.props.navigation.state.params.onGoBack();
		this.props.navigation.goBack();
	}	
	

};


uploadImages = async () => {

	const netStatus = await NetInfo.getConnectionInfo()  

	if (netStatus.type == 'none')
	{
		Alert.alert('no connection');

		return false;
	}
   let max = this.state.pictures.length;
   for(let i = 1; i <= max; i++) {
  
   row = this.state.pictures.pop();
   await lib.setItem('pictures', this.state.pictures);
   this.setState({pictures: this.state.pictures});
   await lib.uploadImageAsync(row);

   }


	    this.props.navigation.state.params.onGoBack();
		this.props.navigation.goBack();

}

  _takePhoto = async () => {

    const {

      status: cameraPerm

    } = await Permissions.askAsync(Permissions.CAMERA);



    const {

      status: cameraRollPerm

    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);



    // only if user allows permission to camera AND camera roll

    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {

      let pickerResult = await ImagePicker.launchCameraAsync({

        allowsEditing: false,

        aspect: [4, 3],

      });


		this.setState({image: pickerResult.uri});

    }

  };

}