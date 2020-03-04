import { battery } from "power";
import * as draw from "../common/drawing.js";
import * as util from "../common/utils.js";
import document from "document";
import { today } from "user-activity";
import * as messaging from "messaging";
import { vibration } from "haptics";
import { faces } from "./faces.js";


const svg = {
	'all': document.getElementById("calories"),
	'arcs': {
		'main': document.getElementById("arc-calories"),
		'excess': document.getElementById("arc-calories2")
	},
	'text': document.getElementById("calories-text"),
	'stats': {
		'all': document.getElementById("calories-stats"),
		'in': document.getElementById("calories-stats-in"),
		'out': document.getElementById("calories-stats-out"),
		'carbs': document.getElementById("calories-stats-carbs"),
		'fats': document.getElementById("calories-stats-fats"),
		'proteins': document.getElementById("calories-stats-proteins"),
		'water': document.getElementById("calories-stats-water"),
		'status': document.getElementById("calories-status")
	}
};


let hidden = false;
let stats_hidden = true;

let data = {};
const CAL_DEFICIT = 250;



function deficit() {
	let elapsed = util.getElapsedSeconds(new Date());
	let total = 60 * 60 * 24;
	
	let perc = elapsed / total;
	
	return Math.floor(CAL_DEFICIT * perc);
}


export function update() {
	svg.stats.status.text = `Request sent (${util.getTime()})`;

	messaging.peerSocket.send('update-food');
	vibration.start("confirmation");
}

export function init() {
	svg.stats.status.text = 'Sync required';
}

export function tick(evt) {
	if(hidden)
		return;
	
	let cal_out = today.local.calories - deficit(); 
	if (data.calories === undefined) {
		draw.drawArc(svg.arcs.main, 0, 1);
		draw.setVisibility(false, svg.arcs.excess);
		return;
	}
	
	let diff = data.calories - cal_out;
	svg.text.text = diff > 0 ? '+' + diff : diff;
	
	if (data.calories < cal_out) { // cal deficit
		draw.drawArc(svg.arcs.main, data.calories, cal_out);
		draw.setVisibility(false, svg.arcs.excess);
	} else if (data.calories < 2 * cal_out) {  // too many cals
		draw.drawArc(svg.arcs.main, 1, 1);
		draw.setVisibility(true, svg.arcs.excess);
		draw.drawArc(svg.arcs.excess, data.calories - cal_out, cal_out);
	} else {
		draw.drawArc(svg.arcs.main, 1, 1);
		draw.setVisibility(true, svg.arcs.excess);
		draw.drawArc(svg.arcs.excess, 1, 1);
	}
	
	if(!stats_hidden) {
		svg.stats.in.text = `In: ${data.calories === undefined ? '?' : data.calories} cals`;
		svg.stats.out.text = `Out: ${cal_out} cals`;
		svg.stats.carbs.text = `Carbs: ${data.carbs === undefined ? '?' : data.carbs} g`;
		svg.stats.fats.text = `Fats: ${data.fats === undefined ? '?' : data.fats} g`;
		svg.stats.proteins.text = `Proteins: ${data.proteins === undefined ? '?' : data.proteins} g`;
		svg.stats.water.text = `Water: ${data.water === undefined ? '?' : data.water} ml`;
	}
}

export function changeFace(face) {
	switch(face) {
		case faces.ALL:
			hidden = false;
			stats_hidden = true;
			break;
		case faces.CALORIES:
			hidden = false;
			stats_hidden = false;
			break;
		default:
			hidden = true;
			break;
	}
	
	draw.setVisibility(!hidden, svg.all);
	draw.setVisibility(!(stats_hidden || hidden), svg.stats.all);
}


messaging.peerSocket.onopen = function() {
	console.log('Connection opened successfully (device)');
	svg.stats.status.text = 'Companion connected';
	
	update();
}

messaging.peerSocket.onclose = function() {
	console.warn('Connection closed (device)');
	svg.stats.status.text = 'Companion disconnected';
}

messaging.peerSocket.onerror = function(err) {
	console.error("Connection error: " + err.code + " - " + err.message);
	svg.stats.status.text = err.message;
	vibration.start("nudge");
}

messaging.peerSocket.onmessage = function(evt) {
	// console.log(JSON.stringify(evt.data));

	if (!evt.data) {
		vibration.start("nudge");
		svg.stats.status.text = 'No data received';
		
		return;
	}

	switch(evt.data.type) {
		case "food-msg":
			vibration.start("nudge");
			svg.stats.status.text = evt.data.msg;
			break;
		case "food":
			vibration.start("confirmation");
			data = evt.data;
			svg.stats.status.text = `Up-to-date (${util.getTime()})`;
			break;
		default:
			console.log(JSON.stringify(evt.data));
			break;
	}
};
