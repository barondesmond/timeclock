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
  noteboxContainer: {
	marginTop: 10,
	backgroundColor: '#DDDDDD',
    alignSelf: 'stretch',
	flex: 1, 
	flexDirection: 'row',
	},

    Red:{
    
	color: '#F44336' 

	},
    Blue:{
    
	color: '#0000ff' 

	},

   buttonContainer: {
    margin: 5,
	backgroundColor: '#DDDDDD',
    alignSelf: 'stretch',
	},

  

	buttonStyle: {
	fontSize: 16,
    textAlign: 'center',
	color: 'blue',
	},

 exampleText: {

    fontSize: 20,

    marginBottom: 20,

    marginHorizontal: 15,

    textAlign: 'center',

  },

  maybeRenderUploading: {

    alignItems: 'center',

    backgroundColor: 'rgba(0,0,0,0.4)',

    justifyContent: 'center',

  },

  maybeRenderContainer: {

    borderRadius: 3,

    elevation: 2,

    marginTop: 30,

    shadowColor: 'rgba(0,0,0,1)',

    shadowOpacity: 0.2,

    shadowOffset: {

      height: 4,

      width: 4,

    },

    shadowRadius: 5,

    width: 250,

  },

  maybeRenderImageContainer: {

    borderTopLeftRadius: 3,

    borderTopRightRadius: 3,

    overflow: 'hidden',

  },

  maybeRenderImage: {

    height: 250,

    width: 250,

  },

  maybeRenderImageText: {

    paddingHorizontal: 10,

    paddingVertical: 10,

  },

noteText: {
    margin: 5,
	marginTop: 60,
	backgroundColor: '#DDDDDD',
	borderColor: 'gray', 
	},
 noteContainer: {
    margin: 5,
	marginTop: 60,
	backgroundColor: '#DDDDDD',
    height: 200, 
	borderColor: 'gray', 
	borderWidth: 1
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
    marginBottom: 10,
	
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getPortalContainer: {
	alignItems: 'flex-start',
    textAlign: 'left',
	margin: 5,

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
	circleContainerStart: {
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
	justifyContent: 'center',
	backgroundColor: 'green' ,
    alignItems: 'center',
    borderWidth: 2,
	},
	circleContainerStop: {
    borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
	justifyContent: 'center',
	backgroundColor: 'red' ,
    alignItems : 'center',
    borderWidth: 2,
   },

 getCircleText: {
    fontSize: 25,
    color: 'black',
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

