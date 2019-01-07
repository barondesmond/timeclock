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
      id: ''
    };
  }


onLoginPress = () => {

console.log(this.state);
this.props.navigation.navigate('Jobs');


}


    render() {
        return (
      <View style={styles.container}>
                <Text 
                    style={{fontSize: 27}}>
                    Login
                </Text>
  
     <TextInput placeholder="Name" 
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                  onChangeText={data => this.setState({ user: data })}
      />
   <TextInput placeholder="Email"
        style={{height: 40, borderColor: 'blue', borderWidth: 1}}
                  onChangeText={data => this.setState({ pass: data })}
      />
	  <View style={styles.contentContainer}>
          <View style={styles.buttonContainer}>
               <Button 
                          onPress={this.onLoginPress}
                          title="Submit"
                      />
		  </View>
		  </View>
 
                  </View>
            )
    }
}