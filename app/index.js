import document from "document";
import * as messaging from "messaging";
import { vibration } from "haptics";

console.log(`Setting up...`);
let background1 = document.getElementById("clickbg1");
let background2 = document.getElementById("clickbg2");
let background3 = document.getElementById("clickbg3");
let Label1 = document.getElementById("Label1");
let Label2 = document.getElementById("Label2");
let Label3 = document.getElementById("Label3");
let responseDisplay = document.getElementById("responseDisplay");
let Blast;
let blastNum;
let counter=0;
let successCounter=0;
let current;
let currentBlast;

// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "Label1" && evt.data.newValue)
    Label1.text = JSON.parse(evt.data.newValue).name;
  if (evt.data.key === "Label2" && evt.data.newValue)
    Label2.text = JSON.parse(evt.data.newValue).name;
  if (evt.data.key === "Label3" && evt.data.newValue)
    Label3.text = JSON.parse(evt.data.newValue).name;
  
  if(evt.data.key==="Blast1" && evt.data.newValue)
    Blast[0]=JSON.parse(evt.data.newValue);
  if(evt.data.key==="Blast2" && evt.data.newValue)
    Blast[1]=JSON.parse(evt.data.newValue);
  if(evt.data.key==="Blast3" && evt.data.newValue)
    Blast[2]=JSON.parse(evt.data.newValue);
  
  if(evt.data.key==="Blast" && evt.data.newValue){
    Blast=evt.data.newValue;
  }
  
  if(evt.data.key==="blastNum" && evt.data.newValue)
    blastNum=JSON.parse(evt.data.newValue);
  if (evt.data.key === "Response") {
    let val=evt.data.value;
    if(typeof(val)==="boolean"){
      if(val)
        val="OK";
      else
        val="FAILED!";
    }
    console.log("Response = " + val)
    if(val.length==12 && (val==="Sending 1..." || val==="Sending 2..." || val==="Sending 3...")){
      current=parseInt(val[8]);
      currentBlast=Blast[current-1];
      if(currentBlast)
        counter=0;
      responseDisplay.style.display = "inline"
      responseDisplay.text = val;
    }
    else if(val==="OK" && currentBlast){
      counter++;
      successCounter++;
      responseDisplay.text = successCounter+"/"+blastNum+" "+val;
    }else if(currentBlast){
      counter++;
      responseDisplay.text = blastNum-successCounter+"/"+blastNum+" "+val;
    }else if(!currentBlast){
      responseDisplay.text = val;
    }
  }
  if (Label1.text == "" && Label2.text == "" && Label3.text == "") {
    Label1.text = "            Please"
    Label2.text = "               set"
    Label3.text = "    configuration."
  }
};


  // Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};

background1.onclick = function(evt) {
  sendVal({key:'msg', value:'1'})
  console.log("Click Label 1");
  vibration.start("confirmation");
}

background2.onclick = function(evt) {
  sendVal({key:'msg', value:'2'})
  console.log("Click Label 2");
  vibration.start("confirmation");
}

background3.onclick = function(evt) {
  sendVal({key:'msg', value:'3'})
  console.log("Click Label 3");
  vibration.start("confirmation");
}

responseDisplay.onclick = function(evt) {
  responseDisplay.style.display = "none"
  console.log("Click Response");
  vibration.start("confirmation");
}

Label1.onclick = background1.onclick
Label2.onclick = background2.onclick
Label3.onclick = background3.onclick

// Send data to device using Messaging API
function sendVal(data) {
  console.log(JSON.stringify(data))
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }  else {
    responseDisplay.style.display = "inline"
    responseDisplay.text = "Phone?";
  }
}

