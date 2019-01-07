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

import styles from  '../components/styles';


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

async saveKey(EmpName, Email) {

    console.log(EmpName);
	console.log(Email);
    try {

      await AsyncStorage.setItem('EmpName', EmpName);
      await AsyncStorage.setItem('Email', Email);

	} catch (error) {


      console.log("Error saving data" + error);

    }
	console.log(EmpName);
	console.log(Email);
	this.props.navigation.navigate('Jobs');


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
                          onPress={(EmpName, Email) => this.saveKey(this.state.EmpName, this.state.Email)}
                          title="Submit"
                      />
		  </View>
		  </View>
 
                  </View>
            )
    }
}