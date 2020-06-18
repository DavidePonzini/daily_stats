import { battery } from "power";
import * as draw from "../common/drawing.js";
import document from "document";
import { faces } from "./faces.js";


let hidden = false;

const svg = {
  'all': document.getElementById("battery"),
  'arc': document.getElementById("arc-battery"),
  'text': document.getElementById("battery-text")
};

export function init() { }


export function tick(evt) {
  if(hidden)
    return;
  
  let battery_lvl = battery.chargeLevel;
  draw.drawArc(svg.arc, battery_lvl, 100);
  
  svg.text.text = battery.charging ? '' : `${battery_lvl}%`;
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