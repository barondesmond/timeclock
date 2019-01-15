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
   
  const emp_url = URL + `empauth_json.php?EmpName=${EmpName}&Email=${Email}&installationId=${Constants.installationId}`;
  console.log(emp_url);

  let response = await fetch(emp_url)
				.catch((error) => console.warn("fetch error:", error))
  
 response = await response.json();
  console.log(response);
   if (response.authorized == 1)
   {
   const EmpNo = response.EmpNo;
   const Email = response.Email;
   const EmpName = response.EmpName;
   this.setState({EmpNo: EmpNo});
   this.setState({data: response});
   this.saveKey(EmpName, Email, EmpNo);
   }
   else
	{
	  Alert.alert('Employee Not Authorized on Device ');
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
	//this.props.navigation.navigate('Home');


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