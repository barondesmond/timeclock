import React, { Component } from 'react';
import { View, Text, Picker, StyleSheet } from 'react-native'



class SelectEvent extends Component {
   state = {event: ''}
   updateEvent = (event) => {
      this.setState({ event: event })
   }
   render() {
      return (
         <View>
            <Picker selectedValue = {this.state.event} onValueChange = {this.updateEvent}>
               <Picker.Item label = "Travel" value = "travel" />
               <Picker.Item label = "Check In" value = "checkin" />
               <Picker.Item label = "Check Out" value = "checkout" />
            </Picker>
            <Text>{this.state.user}</Text>
         </View>
      )
   }
}
export default SelectEvent
