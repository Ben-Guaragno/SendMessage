import document from "document";
import * as messaging from "messaging";
import { vibration } from "haptics";
import * as fs from "fs";
import { me } from "appbit";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";
let settings = loadSettings();
// console.log(JSON.stringify(settings));

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
let curBlastNum;
let counter=0;
let successCounter=0;
let current;
let currentBlast;

update();

// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
//   if (evt.data.key === "Label1" && evt.data.newValue)
//     Label1.text = JSON.parse(evt.data.newValue).name;
//   if (evt.data.key === "Label2" && evt.data.newValue)
//     Label2.text = JSON.parse(evt.data.newValue).name;
//   if (evt.data.key === "Label3" && evt.data.newValue)
//     Label3.text = JSON.parse(evt.data.newValue).name;
  
//   if(evt.data.key==="Blast1" && evt.data.newValue)
//     Blast[0]=JSON.parse(evt.data.newValue);
//   if(evt.data.key==="Blast2" && evt.data.newValue)
//     Blast[1]=JSON.parse(evt.data.newValue);
//   if(evt.data.key==="Blast3" && evt.data.newValue)
//     Blast[2]=JSON.parse(evt.data.newValue);
  
//   if(evt.data.key==="Blast" && evt.data.newValue){
//     Blast=evt.data.newValue;
//   }
  
//   if(evt.data.key==="blastNum" && evt.data.newValue)
//     blastNum=JSON.parse(evt.data.newValue);
  
  if(evt.data.key!="Response"){
    modifySettings(evt.data);
  }
  
  
  
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
      curBlastNum=blastNum[current-1];
      if(currentBlast){
        counter=0;
        successCounter=0;
      }
      responseDisplay.style.display = "inline"
      responseDisplay.text = val;
    }
    else if(val==="OK" && currentBlast){
      counter++;
      successCounter++;
      responseDisplay.text = successCounter+"/"+curBlastNum+" "+val;
    }else if(currentBlast){
      counter++;
      responseDisplay.text = curBlastNum-successCounter+"/"+curBlastNum+" "+val;
    }else if(!currentBlast){
      responseDisplay.text = val;
    }
  }
  
  
  // if (Label1.text == "" && Label2.text == "" && Label3.text == "") {
  //   Label1.text = "            Please"
  //   Label2.text = "               set"
  //   Label3.text = "    configuration."
  // }
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
  vibration.start("bump");
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



function update(){
  Label1.text = settings.label1.text;
  Label2.text = settings.label2.text;
  Label3.text = settings.label3.text;
  if (Label1.text == "" && Label2.text == "" && Label3.text == "") {
    Label1.text = "            Please"
    Label2.text = "               set"
    Label3.text = "    configuration."
  }
  
  
  Blast=[settings.label1.blast, settings.label2.blast, settings.label3.blast];
  blastNum=[settings.label1.blastNum, settings.label2.blastNum, settings.label3.blastNum];
  try{
    background1.style.fill=settings.label1.color;
    background2.style.fill=settings.label2.color;
    background3.style.fill=settings.label3.color;
  }catch(err){
    console.log(err);
  }
}

function modifySettings(data){
  console.log(data.newValue);
  switch(data.key) {
    case 'Label1':
      settings.label1.text=JSON.parse(data.newValue).name;
      break;
    case 'Label2':
      settings.label2.text=JSON.parse(data.newValue).name;
      break;
    case 'Label3':
      settings.label3.text=JSON.parse(data.newValue).name;
      break;
    case 'Blast1':
      settings.label1.blast=data.newValue==="true";
      break;
    case 'Blast2':
      settings.label2.blast=data.newValue==="true";
      break;
    case 'Blast3':
      settings.label3.blast=data.newValue==="true";
      break;
    case 'Color1':
      settings.label1.color=JSON.parse(data.newValue);
      break;
    case 'Color2':
      settings.label2.color=JSON.parse(data.newValue);
      break;
    case 'Color3':
      settings.label3.color=JSON.parse(data.newValue);
      break;
    case 'BlastURL1':
      settings.label1.blastNum=JSON.parse(data.newValue);
      break;
    case 'BlastURL2':
      settings.label2.blastNum=JSON.parse(data.newValue);
      break;
    case 'BlastURL3':
      settings.label3.blastNum=JSON.parse(data.newValue);
      break;
    default:
      console.log("Could not match: "+data.key);
  }
  update()
}

// Register for the unload event
me.onunload = saveSettings;

function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    // Defaults
    console.log("No settings file found");
    return {
      label1: {
        blast: false,
        blastNum: 0,
        text: '',
        color: ''
      },
      label2: {
        blast: false,
        blastNum: 0,
        text: '',
        color: ''
      },
      label3: {
        blast: false,
        blastNum: 0,
        text: '',
        color: ''
      }
    };
  }
}

function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}
