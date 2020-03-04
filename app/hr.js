import { HeartRateSensor } from "heart-rate";
import document from "document";
import { display } from "display";
import * as draw from "../common/drawing.js";
import { user } from "user-profile";
import { faces } from "./faces.js";


const svg = {
  'all': document.getElementById("hr"),
  'arc': document.getElementById("arc-hr"),
  'text': document.getElementById("hr-text"),
  'icon': document.getElementById("hr-icon-systole")
};


let hidden = false;
let hrm = new HeartRateSensor();


export function init() {
  hrm.onreading = update;
  hrm.start();
}


// Actual updates don't follow clock ticks
export function tick() { }


function update() {
  if (!display.on || hidden) {
    return;
  }
  
  let rate = hrm.heartRate;
  
  draw.drawArc(svg.arc, rate - user.restingHeartRate, 180 - user.restingHeartRate);

  //let zone = zoneToText(user.heartRateZone(rate));
  svg.text.text = rate;
  
  svg.icon.style.display = svg.icon.style.display == "none" ? "inline" : "none";
}


function zoneToText(z) {
  switch(z) {
    case 'out-of-range':
      return 'O';
    case 'cardio':
      return 'C';
    case 'peak':
      return 'P';
    case 'fat-burn':
      return 'F';
    default:
      return '?';
  }
}


export function changeFace(face) {
  switch(face) {
    case faces.ALL:
      hidden = false;
      break;
    default:
      hidden = true;
      break;
  }
  
  draw.setVisibility(!hidden, svg.all);
}