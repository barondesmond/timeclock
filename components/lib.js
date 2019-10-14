
import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';
import { NetInfo,   AsyncStorage, Linking,   Alert } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';


export async function fetch_authemp(url) {

var auth = null;
var dispatchs = null;
var jobs = null;
var opt = {
  method: 'get',
  url: url,
  timeout: 2500
}
var response = await axios.get(url, opt)
 

	if (response.data)
	{
		await AsyncStorage.setItem('auth', JSON.stringify(response.data));

	}



}

export async function postData (url) {
	const resp =	await axios.get(url);
	console.log(resp);

	return resp;
  }

export async function postData2 (url, str) {
    try {
      let res = await fetch(`https://postman-echo.com/post`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(str),
      });
      res = await res.json();
      console.log(res)
      return res;
    } catch (e) {
      console.error(e);
    }
  }
export async function mapDirections(address) {
	//https://www.google.com/maps/dir/?api=1&parameters
	const url = `https://www.google.com/maps/search/?api=1&query=` + encodeURI(address);


Linking.canOpenURL(url).then(supported => {
    if (supported) {
        Linking.openURL(url);
    } else {
        Alert.alert(
            'Alert',
            'This URL scheme is not installed',
        )
    }
});


}

export async function uploadImageAsync(row) {


	const netStatus = await NetInfo.getConnectionInfo()  
	if (netStatus.type == 'none')
	{
		Alert.alert('no connection');

		return false;
	}
  let apiUrl = URL + `upload/index.php`;




  let uriParts = row.image.split('.');

  let fileType = uriParts[uriParts.length - 1];


  let formData = new FormData();

  formData.append('photo', {

    uri: row.image,

    name: `${row.key}.${row.EmpNo}.${row.Screen}.${row.reference}.${row.address}.${row.violation}.${row.latitude}.${row.longitude}.${fileType}`,

    type: `multipart/form-data`,

  });


  opt = {

    method: 'POST',

    body: formData,

    headers: new Headers({
        'Accept': 'application/json',
		'Content-Type': 'multipart/form-data; boundary=someArbitraryUniqueString'

    }),

  };
//console.log(apiUrl);
//console.log(opt);


  return fetch(apiUrl, opt);

}

export function getDistance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

export function deg2rad(deg) {
  return deg * (Math.PI/180);
}

export async function  setItem(key, value) {
    try {
        return await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
         console.error('AsyncStorage#setItem error: ' + error.message);
    }
}

export async function  getItem(key) {
    return await AsyncStorage.getItem(key)
        .then((result) => {
            if (result) {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                     console.error('AsyncStorage#getItem error deserializing JSON for key: ' + key, e.message);
                }
            }
            return result;
        });
}
export async function  removeItem(key) {
    return await AsyncStorage.removeItem(key);
}
