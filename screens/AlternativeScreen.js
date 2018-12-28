import React, { Component } from 'react';

import {
    ScrollView,
    Text,
    TextInput,
    View,
	Alert,
	Navigator,
    Button,
	Concat
} from 'react-native';



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

return fetch('https://app.plisolutions.com:7443/primelogic/employees_json.php', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({Name: this.state.user, Email: this.state.pass })})
.then((response) => response.json())
.then((responseJson) => {  } )
.catch((error) =>{ console.error(error); });


}


    render() {
        return (
            <ScrollView style={{padding: 20}}>
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

		<View style={{margin:7}} />
                <Button 
                          onPress={this.onLoginPress}
                          title="Submit"
                      />
                  </ScrollView>
            )
    }
}