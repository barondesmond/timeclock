import React from 'react';
import { FlatList, ActivityIndicator, Text, View  } from 'react-native';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Jobs',
  };

export default class FetchExample extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    return fetch('https://10.111.0.246/primelogic/jobs_json.php')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.jobs,
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
          renderItem={({item}) => <Text>{item.Name}, {item.LastName}</Text>}
          keyExtractor={({id}, index) => id}
        />
      </View>
    );
  }
}
