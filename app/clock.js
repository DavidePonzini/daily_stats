import * as util from "../common/utils";
import document from "document";
import * as draw from "../common/drawing.js";
import { faces } from "./faces.js";


const svg = {
  'all': document.getElementById("clock"),
  'arc': document.getElementById("arc-time"),
  'time': {
    'all': document.getElementById("time"),
    'hm': document.getElementById("hm"),
    'ss': document.getElementById("ss"),
    'date': document.getElementById("date"),
    'dow': document.getElementById("dow"),
  }
};


let hidden = false;


export function init() { }


export function tick(evt) {
  if(hidden)
    return;
  
  let today = evt.date;
  let hours = util.zeroPad(today.getHours());
  let minutes = util.zeroPad(today.getMinutes());
  let seconds = util.zeroPad(today.getSeconds());
  let year = today.getFullYear().toString().substr(-2);
  let month = util.zeroPad(today.getMonth() + 1);
  let day = util.zeroPad(today.getDate());
  let dow = util.dowToLetters(today.getDay());
  
  svg.time.hm.text = `${hours}:${minutes}`;
  svg.time.ss.text = `${seconds}`;
  svg.time.date.text = `${day}/${month}/${year}`;
  svg.time.dow.text = `${dow}`;
  
  let elapsed = util.getElapsedSeconds(evt.date);
  draw.drawArc(svg.arc, 60*60*24 - elapsed, 60*60*24);
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
  draw.setVisibility(!hidden, svg.time.all);
}