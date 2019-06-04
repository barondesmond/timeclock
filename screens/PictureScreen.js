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
    reference: null,
    Screen: null,
	timestamp: null,
	LocName: '',
  };






  render() {

    let {

      image

    } = this.state;

	if (!image)
	{

	}


    return (

      <View style={styles.container}>
	<View style={styles.welcomeContainer}>

        <StatusBar barStyle="default" />

  
	
	
	    {this.renderNoteInput()}
        {this._maybeRenderImage()}
	    
        {this._maybeRenderUploadingOverlay()}

      </View>
    </View>

    );

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

renderNoteInput = () => {

    let {

      image

    } = this.state;



    if (!image) {

      return;

    }

if (this.state.Screen == 'Document')
{
return (
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
);
}

return ( <View>
	<Text style={styles.buttonContainer}>Enter Note</Text>
	    <TextInput placeholder="Note" 
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={data => this.setState({ violation: data })}
      />	
</View>);
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



  _share = () => {

    Share.share({

      message: this.state.image,

      title: 'Check out this photo',

      url: this.state.image,

    });

  };



  _copyToClipboard = async () => {
	  
		uploadImageAsync(this.state.image);
		Alert.alert(`Upload Complete ${image} ${this.state.EmpNo}  ${this.state.violation} ${this.state.LocName} ${this.state.latitude} ${this.state.longitude} ${this.state.reference} ${this.state.Screen} ${this.state.timestamp}`);

		this.setState({image: null, violation: ''});
		this.props.navigation.state.params.onGoBack();
		this.props.navigation.goBack();

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

   let pictures = await this.getItem('pictures');
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
	   this.removeItem('pictures');

	   pictures = [];
	   pictures.push(picture);
	   console.log('else');
	   console.log(pictures);

    }

   await this.setItem('pictures', pictures)
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

	if (!this.state.image)
	{
		console.log('take a picture');
		this._takePhoto();
	}
	else
	{
		console.log('picture taken');
		this.props.navigation.state.params.onGoBack();
		this.props.navigation.goBack();
	}	
	

};

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

    }

  };



  _handleImagePicked = async pickerResult => {

    let uploadResponse, uploadResult;



    try {

      this.setState({

        uploading: true

      });



      if (!pickerResult.cancelled) {

        uploadResponse = await uploadImageAsync(pickerResult.uri);

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



async function uploadImageAsync(uri) {

  let apiUrl = URL + `upload/index.php`;




  let uriParts = uri.split('.');

  let fileType = uriParts[uriParts.length - 1];


  let formData = new FormData();

  formData.append('photo', {

    uri,

    name: `${timestamp}.${EmpNo}.${Screen}.${reference}.${LocName}.${violation}.${latitude}.${longitude}.${fileType}`,

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


