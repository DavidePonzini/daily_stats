import clock from "clock";
import * as util from "../common/utils";
import document from "document";
import * as battery from "./battery.js";
import * as time from "./clock.js";
import * as calories from "./calories.js";
import * as hr from "./hr.js";
import {faces, getFace, setFace} from "./faces.js";


const clicker = {
  'center': document.getElementById("clicker-center"),
  'top_right': document.getElementById("clicker-top-right"),
  'bottom_right': document.getElementById("clicker-bottom-right"),
  'bottom_left': document.getElementById("clicker-bottom-left"),
  'top_left': document.getElementById("clicker-top-left")
};

const modules = [
  battery,
  calories,
  time,
  hr
];


set_face(faces.ALL);


// Init all modules
modules.forEach(function(m) {
  m.init();
});


// Update the clock every minute
clock.granularity = "seconds";


// Update the <text> elements every tick with the current time
clock.ontick = (evt) => {
  modules.forEach(function(m) {
    m.tick(evt)
  });
}


// Handle clicker events, depending on current face
clicker.center.onclick = () => {
  switch(getFace()) {
    case faces.CALORIES:
      calories.update();
      break;
    default:
      break;
  }
};


clicker.top_right.onclick = () => {
  switch(getFace()) {
    case faces.ALL:
      set_face(faces.CALORIES);
      break;
    case faces.CALORIES:
      set_face(faces.ALL);
      break;
    default:
      break;
  }
};


clicker.bottom_right.onclick = () => {
  switch(getFace()) {
    default:
      break;
  }
};


clicker.bottom_left.onclick = () => {
  switch(getFace()) {
    default:
      break;
  }
};


clicker.top_left.onclick = () => {
  switch(getFace()) {
    default:
      break;
  }
};


function set_face(f) {
  setFace(f);
  
  modules.forEach(function(m) {
    m.changeFace(f)
  });
}
