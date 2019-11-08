import React, { Component } from 'react';

import {
    ScrollView,
    Text,
    TextInput,
    View,
	Alert,
	Navigator,
    Button,
	Concat,
    StyleSheet,
    AsyncStorage,
} from 'react-native';

import { Constants } from 'expo';

import styles from  '../components/styles';
import * as lib from '../components/lib';

import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';


export default class AlternativeScreen extends Component {


 constructor(props) {
    super(props);
    this.state = {
      user: 'Username',
      pass: 'Password',
      image: 'Image',
      isLoading: true,
      id: '',
	  data: null,
      EmpName: null,
      Email: null,
    };
  }


async fetchEmployeeFromApi (EmpName, Email) {
   
  const emp_url = URL + `empauth_json.php?EmpName=${EmpName}&Email=${Email}&installationId=${Constants.installationId}&version=${Constants.manifest.version}&dev=${__DEV__}`;

  await fetch(emp_url) .then((response) => response.json())
	        .then((responsejson) => {

        this.setState({
          isLoading: false,
          data: responsejson,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });

 console.log(this.state.data);

   if (this.state.data.authorized == 1)
   {
   const EmpNo = this.state.data.EmpNo;
   const Email = this.state.data.Email;
   const EmpName = this.state.data.EmpName;
   this.setState({EmpNo: EmpNo});
   this.saveKey(EmpName, Email, EmpNo);
   }
   else if (this.state.data.authorized == 0 && this.state.data.Email != '')
   {
	   Alert.alert('Email Sent to ' + this.state.data.Email);
   }
   else
	{
	  Alert.alert('Not Authorized ' + this.state.data.authorized);
	this.props.navigation.navigate('Home');
	   return false;
    }
 

}


async saveKey(EmpName, Email, EmpNo) {

    console.log(EmpName);
	console.log(Email);
	try {

      await AsyncStorage.setItem('EmpName', EmpName);
      await AsyncStorage.setItem('Email', Email);
      await AsyncStorage.setItem('EmpNo', EmpNo);

	} catch (error) {


      console.log("Error saving data" + error);

    }
	console.log(EmpName);
	console.log(Email);
	console.log(EmpNo);
	if (this.props.navigation.state.params)
	{
		this.props.navigation.state.params.onGoBack();
		this.props.navigation.goBack();
	}
	else
	{
		this.props.navigation.navigate('Home');
	}


  }



    render() {
        return (
      <View style={styles.container}>
                <Text 
                    style={{fontSize: 27}}>
                    Name and Email
                </Text>
  
     <TextInput placeholder="EmpName" 
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={data => this.setState({ EmpName: data })}
      />
   <TextInput placeholder="Email"
        style={{height: 40, borderColor: 'blue', borderWidth: 1}}
                  onChangeText={data => this.setState({ Email: data })}
      />
	  <View style={styles.contentContainer}>
          <View style={styles.buttonContainer}>
               <Button 
                          onPress={(EmpName, Email) => this.fetchEmployeeFromApi(this.state.EmpName, this.state.Email)}
                          title="Submit"
                      />
		  </View>
		  </View>
 
                  </View>
            )
    }
}