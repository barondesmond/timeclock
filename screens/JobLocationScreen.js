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


} from 'react-native';

import { Constants, ImagePicker, Permissions, Location } from 'expo';

import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';

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
	LocName: '',
  };


  render() {

    let {

      image

    } = this.state;



    return (

      <View style={styles.container}>
	<View style={styles.welcomeContainer}>

        <StatusBar barStyle="default" />


	
        <Button onPress={this._takePhoto} title="Job Location Picture" />
	
        {this._maybeRenderImage()}

        {this._maybeRenderUploadingOverlay()}

      </View>
    </View>

    );

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

			<View>
			<Text style={styles.buttonContainer}>
			Please enter name of location
			</Text>
			<Text style={styles.buttonContainer}>
	  {this.state.LocName} {this.state.latitude} {this.state.longitude}
		</Text>
		    <TextInput placeholder="Location" 
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={data => this.setState({ violation: data })}
      />
		  </View>

        <View

          style={styles.maybeRenderImageContainer}>
		  
          <Image source={{ uri: image }} style={styles.maybeRenderImage} />

        </View>

	

       <Button title="Upload Job Location"

          onPress={this._copyToClipboard}

          style={styles.maybeRenderImageText} />
      </View>

    );

  };



  _share = () => {

    Share.share({

      message: this.state.image,

      title: 'Check out this photo',

      url: this.state.image,

    });

  };



  _copyToClipboard = async () => {
	  
		uploadImageAsync(this.state.image, this.state.EmpNo, this.state.violation, this.state.latitude, this.state.longitude, this.state.LocName);
		this.setState({image: null, violation: ''});
		Alert.alert(`Upload Complete ${this.state.EmpNo}  ${this.state.violation} ${this.state.LocName} ${this.state.latitude} ${this.state.longitude}`);
		this.props.navigation.state.params.onGoBack();
		this.props.navigation.goBack();

  };


async componentDidMount () {


	  this._getLocationAsync();
	  if (!this.state.locationstatus)
	  {
		 let location = await Location.getCurrentPositionAsync({});
		 console.log(location);
		 this.setState({latitude: location.coords.latitude, longitude: location.coords.longitude});
	  }
	if (this.state.LocName == '')
	{
		this.setState({LocName: this.props.navigation.state.params.LocName});
	}

	  const EmpNo = await AsyncStorage.getItem('EmpNo');

	  this.setState({EmpNo: EmpNo});
	  if (!this.state.EmpNo)
	  {

		  this.props.navigation.navigate('Alternative');
	  }


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

        allowsEditing: true,

        aspect: [4, 3],

      });


		this.setState({image: pickerResult.uri});
      //this._handleImagePicked(pickerResult);

    }

  };



  _pickImage = async () => {

    const {

      status: cameraRollPerm

    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);



    // only if user allows permission to camera roll

    if (cameraRollPerm === 'granted') {

      let pickerResult = await ImagePicker.launchImageLibraryAsync({

        allowsEditing: true,

        aspect: [4, 3],

      });


		this.setState({image: pickerResult.uri});
      //this._handleImagePicked(pickerResult);

    }

  };



  _handleImagePicked = async pickerResult => {

    let uploadResponse, uploadResult;



    try {

      this.setState({

        uploading: true

      });



      if (!pickerResult.cancelled) {

        uploadResponse = await uploadImageAsync(pickerResult.uri, this.state.EmpNo, this.state.violation, this.state.latitude, this.state.longitude, this.state.LocName);

        uploadResult = await uploadResponse.json();



        this.setState({

          image: uploadResult.location

        });

      }

    } catch (e) {

      console.log({ uploadResponse });

      console.log({ uploadResult });

      console.log({ e });

      alert('Upload failed, sorry :(');

    } finally {

      this.setState({

        uploading: false

      });

    }

  };

}



async function uploadImageAsync(uri, EmpNo, violation, latitude, longitude, LocName) {

  let apiUrl = URL + `upload/index.php`;




  let uriParts = uri.split('.');

  let fileType = uriParts[uriParts.length - 1];


  let formData = new FormData();

  formData.append('photo', {

    uri,

    name: `${EmpNo}.${violation}.${LocName}.${latitude}.${longitude}.${fileType}`,

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
console.log(apiUrl);
console.log(opt);


  return fetch(apiUrl, opt);

}


