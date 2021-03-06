
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
  NetInfo,
  Alert,


} from 'react-native';

import { Constants, ImagePicker, Permissions } from 'expo';

import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';

import * as lib from '../components/lib';

import styles from '../components/styles';


export default class CameraScreen extends Component {

  state = {

    image: null,
    uploading: false,
    violation: '',
    EmpNo: null
  };



  render() {

    let {

      image

    } = this.state;



    return (

      <View style={styles.container}>
	<View style={styles.welcomeContainer}>
	<Text style={[styles.Red]}> This is a policy violation.  Biometric approval recommended for login.
		
		 </Text>
        <StatusBar barStyle="default" />


	
        <Button onPress={this._takePhoto} title="Take a photo" />



        {this._maybeRenderImage()}

        {this._maybeRenderUploadingOverlay()}

      </View>
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

		<View>
			<Text style={styles.buttonContainer}>
			Please enter reason for violation
			</Text>
		    <TextInput placeholder="violation" 
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={data => this.setState({ violation: data })}
      />
   <Button title="Continue"

          onPress={this._copyToClipboard}

          style={styles.maybeRenderImageText} />
      </View>

        <View

          style={styles.maybeRenderImageContainer}>
		  
          <Image source={{ uri: image }} style={styles.maybeRenderImage} />

        </View>

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
	  
    this.setState({violation: await AsyncStorage.getItem('violation')});
	if (this.state.violation && this.state.violation.length>0)
	{

		const Screen = await AsyncStorage.getItem('Screen');
		await this.loadPictures();
		const upload = await this.uploadImages();
		if (upload)
		{
			this.props.navigation.navigate(Screen);

		}
		
	}
	else
	 {
		Alert.alert('Violation not noted ');
	 }


  };

async loadPictures () {


		pictures = await lib.getItem('pictures');
		this.setState({pictures: pictures});
	
		this.setState({loadingPictures: false});

return true;
}

uploadImages = async () => {

	const netStatus = await NetInfo.getConnectionInfo()  

	if (netStatus.type == 'none')
	{
		Alert.alert('no connection');

		return false;
	}
   Alert.alert('Uploadig Pictures ' + this.state.pictures.length);
   let max = this.state.pictures.length;
   for(let i = 1; i <= max; i++) {
  
   row = this.state.pictures.pop();
   await lib.setItem('pictures', this.state.pictures);
   this.setState({pictures: this.state.pictures});
   await lib.uploadImageAsync(row);

   }
   Alert.alert('Images Uploaded ');
	return true;
}

async componentDidMount () {


	  const EmpNo = await AsyncStorage.getItem('EmpNo');

	  this.setState({EmpNo: EmpNo});
	  if (!this.state.EmpNo)
	  {

		  this.props.navigation.navigate('Alternative');
	  }

}

  _takePhoto = async () => {

      this.props.navigation.navigate('Picture', {onGoBack: () => this._copyToClipboard(), Screen: 'Camera', LocName: 'CameraScreen' , address: 'violation' , reference: 'violation'});


  };

}

 






