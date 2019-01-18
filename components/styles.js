import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Alert,
  Navigator,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import { WebBrowser, Constants } from 'expo';




export default StyleSheet.create({
  container: {
    flex : 1,
	backgroundColor: '#ffffff',

	},

  contentContainer: {
    padding: 5,
    color: '#fff',
   borderColor: 'gray',
	borderWidth: 2,

  },
   buttonContainer: {
    margin: 5,
	backgroundColor: '#DDDDDD',
    alignSelf: 'stretch',

	},
   jobNotesContainer: {
    height: 100,
    margin: 5,
	backgroundColor: '#DDDDDD',
    alignSelf: 'stretch',

	},


  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
 
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },

 
  preview: {

   flex: 1,

   justifyContent: 'flex-end',

   alignItems: 'center',

   height: Dimensions.get('window').height,

   width: Dimensions.get('window').width

 },

  capture: {

    flex: 0,

    backgroundColor: '#fff',

    borderRadius: 5,

    color: '#000',

    padding: 10,

    margin: 40

  }

});
