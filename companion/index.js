import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { geolocation } from "geolocation";

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("Companion Socket Open");
  restoreSettings();
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("Companion Socket Closed");
};

// A user changes settings
settingsStorage.onchange = evt => {
  let data = {
    key: evt.key,
    newValue: evt.newValue
  };
  sendVal(data);
  if(evt.key==="BlastURL")
    sendVal({key:'blastNum', newValue:JSON.parse(settingsStorage.getItem('BlastURL')).length});
};

// Restore any previously saved settings and send to the device
function restoreSettings() {
  sendVal({key:'Label1', newValue:settingsStorage.getItem('Label1')});
  sendVal({key:'Label2', newValue:settingsStorage.getItem('Label2')});
  sendVal({key:'Label3', newValue:settingsStorage.getItem('Label3')});
  let blast=new Array();
  blast.push(settingsStorage.getItem('Blast1'));
  blast.push(settingsStorage.getItem('Blast2'));
  blast.push(settingsStorage.getItem('Blast3'));
  for(let i in blast){blast[i]=(blast[i]==="true")}
  sendVal({key:'Blast', newValue:blast});
  if(settingsStorage.getItem('BlastURL'))
    sendVal({key:'blastNum', newValue:JSON.parse(settingsStorage.getItem('BlastURL')).length});
}

// Send data to device using Messaging API
function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}

// Message is received
messaging.peerSocket.onmessage = evt => {
  recieveHandler(evt);
}

// Asynchronous message handler
async function recieveHandler(evt) {
  console.log(`Phone received: ${JSON.stringify(evt.data)}`);
  //Parse relevant information in order to fire a request
  let msg = evt.data.value
  sendVal({key:'Response', value:'Sending ' + msg + "..."})
  let label = ""
  try {label = JSON.parse(settingsStorage.getItem('Label'+msg)).name} catch(err) {} 
  let url = ""
  let blast=JSON.parse(settingsStorage.getItem('Blast'+msg));
  if(!blast){
    try {url = JSON.parse(settingsStorage.getItem('URL'+msg)).name} catch(err) {} 
    try{
      url=await dataReplace(url, 1, msg);
    }catch(error){
      console.log(error);
      sendVal({key:'Response', value:false});
      return;
    }
  }
  let data = ""
  try {data = JSON.parse(settingsStorage.getItem('Data'+msg)).name} catch(err) {}
  let headers = ""
  try {headers = JSON.parse(settingsStorage.getItem('Headers'+msg)).name} catch(err) {}
  
  console.log("Blast =  "+blast)
  console.log("URL = "+ url)
  console.log("Data = " + data)
  console.log("Headers = " + headers)
  
  //No data, send GET request
  if (data == ""){
    if (headers == ""){
      if(blast){
        requestBlaster({method: "GET"})
      }else{
        fetch(url, {method: "GET"}) 
        .then(function(response) {sendVal({key:'Response', value:response.ok})})
        .catch(function(error){sendVal({key:'Response', value:false}); console.log(error)})
      }
    }
    else{
      if(blast){
        requestBlaster({method: "GET", headers: JSON.parse(headers)})
      }else{
      fetch(url, {method: "GET", headers: JSON.parse(headers)})
        .then(function(response) {sendVal({key:'Response', value:response.ok})})
        .catch(function(error){sendVal({key:'Response', value:false}); console.log(error)})
      }
    }
  }
  //Data, send POST request
  else {
    try{
      data=await dataReplace(data, 0, msg);
    }catch(error){
      console.log(error);
      sendVal({key:'Response', value:false});
      return;
    }
    
    if (headers == ""){
      if(blast){
        requestBlaster({method: "POST", body: data})
      }else{
        fetch(url, {method: "POST", body: data}) 
          .then(function(response) {sendVal({key:'Response', value:response.ok})})
          .catch(function(error){sendVal({key:'Response', value:false}); console.log(error)})
      }
    }
    else {
      if(blast){
        requestBlaster({method: "POST", headers: JSON.parse(headers), body: data})
      }else{
      fetch(url, {method: "POST", headers: JSON.parse(headers), body: data})
        .then(function(res){sendVal({key:'Response', value:res.ok}); return res})
        .then(res => res.text())
        .catch(function(error){sendVal({key:'Response', value:false}); console.log(error)})
      }
    }
  }
};

/*
  Replace flags in a string with relevant values
  isEncode encodes the data for use in a url when passed 1, does not when passed 0
  Valid flags: ~Lbl   Label Text
               ~loc   Location
               ~time  Time value of location data
               ~acc   Accuracy of location data
*/
async function dataReplace(s, isEncode, msg){
  let loc;
  let accuracy;
  let time;
  
  let label = ""
  try {label = JSON.parse(settingsStorage.getItem('Label'+msg)).name} catch(err) {}
  if(isEncode)
    label=encodeURIComponent(label);
  
  if(s.includes("~loc") || s.includes("~time") || s.includes("~acc")){
    console.log("Location call initiated");
  
    let ret=await getLocation();
    console.log("getLocation returned");
    console.log(ret);
    if(isEncode){
       loc=encodeURIComponent(ret.loc);
       time=encodeURIComponent(ret.time);
       accuracy=encodeURIComponent(ret.accuracy);
    }else{
       loc=ret.loc;
       time=ret.time;
       accuracy=ret.accuracy;
    }
    
    return s.replace(/~Lbl/g,label).replace(/~loc/g,loc).replace(/~time/g,time).replace(/~acc/g,accuracy);
  }else{
    return s.replace(/~Lbl/g,label);
  }
}

//Function to get the location of the device
async function getLocation(){
  let time;
  let accuracy;
  let loc;
  let isError=false;
  let promise=new Promise(function(resolve, reject){
    let options={enableHighAccuracy: true, timeout:5000};
    geolocation.getCurrentPosition(function(position) {
      let date=new Date(position.timestamp);
      time=date.toLocaleString();
      accuracy=position.coords.accuracy;
      loc=position.coords.latitude+","+position.coords.longitude;
      
      //For testing error handling. Induce an error
      if(false){
        reject(new Error("Failed to get location"));
      }
      
      //For testing on a simulator. Induce a 5 second wait into the geolocation fetch
      if(false){
        setTimeout(() => {
          resolve({
            loc: loc,
            time: time,
            accuracy: accuracy
          });
        }, 5000);
      }
      else{
        resolve({
          loc: loc,
          time: time,
          accuracy: accuracy
        });
      }
    }, function(error){
      isError=true;
      reject(Error("Failed to get location"));
    }, options)
  });
  
  return promise;
}

/*
  Fires off multile web requests on one button click
  Passed the url and relevant request data
*/
async function requestBlaster(data){
  let urls=JSON.parse(settingsStorage.getItem('BlastURL'));
  let i;
  for(i in urls){
    console.log(urls[i].name);
    let tmpURL=await dataReplace(urls[i].name, 1);
    console.log(tmpURL);
    fetch(tmpURL, data) 
        .then(function(response) {sendVal({key:'Response', value:response.ok})})
        .catch(function(error){sendVal({key:'Response', value:false}); console.log(error)})
  }
}

//If blast values are not set, set them all to false
if(settingsStorage.getItem('Blast1')==null){
  settingsStorage.setItem('Blast1',false);
  settingsStorage.setItem('Blast2',false);
  settingsStorage.setItem('Blast3',false);
}