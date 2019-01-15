
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


} from 'react-native';

import { Constants, ImagePicker, Permissions } from 'expo';

import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';


export default class App extends Component {

  state = {

    image: null,
    uploading: false,
    violation: '',
    EmpNo: null,
  };



  render() {

    let {

      image

    } = this.state;



    return (

      <View style={styles.container}>

        <StatusBar barStyle="default" />



        <Button onPress={this._takePhoto} title="Take a photo" />



        {this._maybeRenderImage()}

        {this._maybeRenderUploadingOverlay()}

      </View>

    );

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

        <View

          style={styles.maybeRenderImageContainer}>
		  
          <Image source={{ uri: image }} style={styles.maybeRenderImage} />

        </View>



        <Text

          onPress={this._copyToClipboard}

          style={styles.maybeRenderImageText}>
		   Post Image {image} and Reason {this.state.violation}

        </Text>

		    <TextInput placeholder="violation" 
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={data => this.setState({ violation: data })}
      />
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
	  
	if (this.state.violation.length>0)
	{
		 await AsyncStorage.setItem('violation', this.state.violation);
		await AsyncStorage.setItem('image', this.state.image);
		//this.props.navigation.navigate('Start');
	}


  };


async componentDidMount () {


	  const EmpNo = await AsyncStorage.getItem('EmpNo');
	  this.setState({EmpNo: EmpNo});
	  console.log(this.state);


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



      this._handleImagePicked(pickerResult);

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



      this._handleImagePicked(pickerResult);

    }

  };



  _handleImagePicked = async pickerResult => {

    let uploadResponse, uploadResult;



    try {

      this.setState({

        uploading: true

      });



      if (!pickerResult.cancelled) {

        uploadResponse = await uploadImageAsync(pickerResult.uri, this.state.EmpNo);

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



async function uploadImageAsync(uri, EmpNo) {

  let apiUrl = URL + `upload/index.php`;




  let uriParts = uri.split('.');

  let fileType = uriParts[uriParts.length - 1];


  let formData = new FormData();

  formData.append('photo', {

    uri,

    name: `${EmpNo}.${fileType}`,

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



const styles = StyleSheet.create({

  container: {

    alignItems: 'center',

    flex: 1,

    justifyContent: 'center',

  },

  exampleText: {

    fontSize: 20,

    marginBottom: 20,

    marginHorizontal: 15,

    textAlign: 'center',

  },

  maybeRenderUploading: {

    alignItems: 'center',

    backgroundColor: 'rgba(0,0,0,0.4)',

    justifyContent: 'center',

  },

  maybeRenderContainer: {

    borderRadius: 3,

    elevation: 2,

    marginTop: 30,

    shadowColor: 'rgba(0,0,0,1)',

    shadowOpacity: 0.2,

    shadowOffset: {

      height: 4,

      width: 4,

    },

    shadowRadius: 5,

    width: 250,

  },

  maybeRenderImageContainer: {

    borderTopLeftRadius: 3,

    borderTopRightRadius: 3,

    overflow: 'hidden',

  },

  maybeRenderImage: {

    height: 250,

    width: 250,

  },

  maybeRenderImageText: {

    paddingHorizontal: 10,

    paddingVertical: 10,

  }

});



