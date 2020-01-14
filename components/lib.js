
import {COLOR_PRIMARY, COLOR_SECONDARY, FONT_NORMAL, FONT_BOLD, BORDER_RADIUS, URL, STORAGE_KEY} from '../constants/common';
import { NetInfo,   AsyncStorage, Linking,   Alert } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
export async function fetch_cancel() {

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

source.cancel('Operation canceled');

}



export async function fetch_authemp(url) {

var auth = null;
var dispatchs = null;
var jobs = null;
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
var opt = {
  method: 'get',
  url: url,
  timeout: 2500,
  cancelToken: source.token
}
 console.log('axios fetch ' + url);

var response = await axios.get(url, opt) 
	.catch(function (thrown) { 
	console.log(thrown);
	if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
    } else {
    console.log(thrown);
    }
  });

await source.cancel('Operation canceled');

	if (response && response.data)
	{
		if (response.data.authorized == 1)
		{	
			console.log('authorized ' + response.data.authorized);
		   await setItem('auth', response.data);

		}
		else
		{
			//console.log(response.data);
			console.log('not authorized' + response.data.authorized);
			Alert.alert(response.data.authorized);
		}
		   return response.data;
	
	}
	else
    {
		return false;
	}

return false;

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
export async function log_init(log)
{
	if (!log.EmpNo)
	{
			log.EmpNo = '';
	}
	if (!log.event)
	{
		log.event = '';
	}
	if (!log.Dispatch)
	{
		log.Dispatch = '';
	}
	if (!log.Counter)
	{
		log.Counter = '';
	}
	if (!log.checkinStatus)
	{
		log.checkinStatus = ';'
	}
	if (!log.violation)
	{
		log.violation = '';
	}
	if (!log.image)
	{
		log.image = '';
	}
	if (!log.latitude)
	{
		log.latitude = '';
	}
	if (!log.longitude)
	{
		log.longitude = '';
	}
	if (!log.Screen)
	{
		log.Screen = '';
	}
	if (!log.change)
	{
		log.change = '';
	}
	if (!log.addDispatchNote)
	{
		log.addDispatchNote = '';
	}
	if (!log.addJobNote)
	{
		log.addJobNote = '';
	}
	if (!log.addEmployeeNote)
	{
		log.addEmployeeNote = '';
	}
return log;
}

export async function url_create(log)
{

		var authurl = URL + `authempinst_json.php?EmpNo=${log.EmpNo}&installationId=${Constants.installationId}&version=${Constants.manifest.version}&event=${log.event}&Dispatch=${log.Dispatch}&Counter=${log.Counter}&Name=${log.Name}&JobID=${log.JobID}&checkinStatus=${log.checkinStatus}&violation=${log.violation}&image=${log.image}&latitude=${log.latitude}&longitude=${log.longitude}&Screen=${log.Screen}&addDispatchNote=${log.addDispatchNote}&addJobNote=${log.addJobNote}&addEmployeeNote=${log.addEmployeeNote}&Complete=${log.Complete}&customer=${log.customer}&customerimage=${log.customerimage}&dev=${__DEV__}&change=${log.change}`;
		console.log(authurl);
return authurl;
}

export async function add_url(url) {

urls = await getItem('urls');
if (!urls)
{
	urls = [];
}
   var upload = true;
   
   if (url)
   {
	   urls.push(url);
	   console.log(urls);
	   await setItem('urls', urls);
   }
   if (!urls || urls.length == 0)
   {
	   return upload;
   }
	let max = urls.length;
	for(let i = 1; i <= max; i++) {
		console.log(i + max);
	var urlsend = urls.shift();
	var resp = await fetch_authemp(urlsend);

	console.log(resp);
	if (resp && resp.authorized)
	{
		await setItem('urls', urls);

	}
	else
	{
		urls.push(urlsend);
		await setItem('urls', urls);

	}

	}
return resp;

}



export async function uploadImages() {

   pictures = await getItem('pictures');
   var upload = true;

   if (!pictures || pictures.length == 0)
   {
	   return upload;
   }
   let max = pictures.length;
   for(let i = 1; i <= max; i++) {
  
   row = pictures.pop();
   resp = await uploadImageAsync(row);
   if (!resp || !resp.location)
   {
	   Alert.alert('error upload image' + i);
	   return false;
   }
   else
	{
	   //Alert.alert('upload image ' + i);
	   await setItem('pictures', pictures);
	   var s = i;
   }
   }
if (s)
{
	return s;
}
else {
return upload;
}

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

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

  opt = {
	timeout: 2500,
	cancelToken: source.token,
	headers: {
        'Accept': 'application/json',
		'Content-Type': 'multipart/form-data; boundary=someArbitraryUniqueString'

    },

  };

var response = await axios.post(apiUrl, formData, opt) 
	.catch(function (thrown) { 
	if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
    } else {
    console.log(thrown);
    }
  });
await source.cancel('Operation canceled');

  return response.data;

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
