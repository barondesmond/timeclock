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
  ScrollView,
  TextInput,
  AsyncStorage,
  Alert,
  NetInfo

} from 'react-native';

import { Constants, ImagePicker, Permissions } from 'expo';

import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';
import * as lib from '../components/lib';

import styles from '../components/styles';


export default class CameraScreen extends Component {

  state = {

    image: null,
	pictures: null,
    uploading: false,
    violation: '',
    EmpNo: null,
	pickerResult: null,
	loadingPictures: true,
  };




async loadPictures () {


		pictures = await lib.getItem('pictures');
		this.setState({pictures: pictures});
	
		this.setState({loadingPictures: false});

return true;
}






async componentWillMount () {

	if (!this.state.pictures && this.state.loadingPictures == true)
	{
        this.loadPictures();
		
	}


}



renderPictures() {

if (!this.state.pictures || this.state.pictures.length <= 0)
{
	return false;
}

     return (<View>
    {this.state.pictures.map((row) => (
        <Image key={row.key} source={{ uri: row.image}} style={styles.maybeRenderImage} />
    ))}
    </View>);
}

renderPicture() {
	if (!this.state.image)
	{
		return false;
	}

return (     <View

          style={styles.maybeRenderImageContainer}>
		  
          <Image source={{ uri: image }} style={styles.maybeRenderImage} />

        </View>
			);

}

 renderList = () => {

	 if (this.state.loadingPictures == true)
	 {

		 return false;
	 }
	 if (!this.state.pictures || this.state.pictures.length <= 0)
	 {
		 return false;
	 }
	return (this.state.pictures.map((row)=>(<Image key={row.key} source={{ uri: row.image }} style={styles.maybeRenderImage} /> ) ));
  }

renderUpload = () => {

if (this.state.pictures && this.state.pictures.length > 0)
{
return (<View><Button onPress={this.uploadImages} title="Upload a Document" /></View>);

}

}

  render() {



    return (

      <ScrollView style={styles.container}>
	<View style={styles.welcomeContainer}>

        <StatusBar barStyle="default" />

	
        <Button onPress={this._takePhoto} title="Scan a Document" />
	  {this.renderUpload()}
	  {this.renderList()}
      </View>
    </ScrollView>

    );

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

}


_takePhoto = () => {

     this.props.navigation.navigate('Picture', {onGoBack: () => this.loadPictures(), LocName: 'receipt' , address: 'wherever' , reference: 'takeitaway', Screen: 'Document'});


return false;

}

 



}



async function uploadImageAsync(row) {

  let apiUrl = URL + `upload/index.php`;




  let uriParts = row.image.split('.');

  let fileType = uriParts[uriParts.length - 1];


  let formData = new FormData();

  formData.append('photo', {

    uri: row.image,

    name: `${row.key}.${row.EmpNo}.${row.Screen}.${row.reference}.${row.LocName}.${row.violation}.${row.latitude}.${row.longitude}.${fileType}`,

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


   
 



 


 






