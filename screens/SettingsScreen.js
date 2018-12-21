import React from 'react';
import { FlatList, ActivityIndicator, Text, View  } from 'react-native';

export default class SettingsScreen extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    return fetch('http://10.111.0.246/primelogic/employees_json.php')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.employees,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }



  render(){

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={{flex: 1, paddingTop:20}}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.EmpName}, {item.Email}</Text>}
          keyExtractor={({id}, index.toString()) => id}
        />
      </View>
    );
  }
}