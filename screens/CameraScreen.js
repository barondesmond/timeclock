
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

		this.props.navigation.navigate(Screen);
	}


  };


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

 






