
import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';
import { NetInfo } from 'react-native';

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

    name: `${row.key}.${row.EmpNo}.${row.Screen}.${row.reference}.${row.LocName}.${row.violation}.${row.latitude}.${row.longitude}.${fileType}`,

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
  return deg * (Math.PI/180)
}
