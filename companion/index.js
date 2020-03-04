import * as messaging from "messaging";
import { settingsStorage } from "settings";
import * as util from "../common/utils.js";


var tokens = null;


async function refreshToken() {
	sendMessage('Refreshing Token...');
	
	console.log(JSON.stringify(tokens));
	
	let res = await fetch('https://api.fitbit.com/oauth2/token', {
	method: "POST",
	headers: {
		'Authorization': `Basic ${btoa('22BB79:e9973a9a5e5fef8367d4c00285a3d290')}`,
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	body: `grant_type=refresh_token&refresh_token=${tokens.refresh_token}`
	});
	
	let data = await res.json();
	if(checkApiError(data))
	return false;
	
	tokens = data;
	
	console.log(JSON.stringify(tokens));
	
	return true;
}


function getUpdateUrl() {
	let date = new Date();
	let todayDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; //YYYY-MM-DD
	
	return `https://api.fitbit.com/1/user/-/foods/log/date/${todayDate}.json`
}


function checkApiError(data) {
	if(data.success === undefined || data.success === true)
	return false;
	
	console.error(JSON.stringify(data));

	data.errors.forEach(e => {
	console.error(e.message);

	switch(e.errorType) {
		case 'expired_token':
		sendMessage('Access token expired');
		break;
		case 'invalid_token':
		sendMessage('Invalid access token');
		tokens = null;
		break;
		case 'invalid_grant':
		sendMessage('Invalid refresh token');
		tokens = null;
		break;
		default:
		sendMessage(e.message);
		break;
	}
	});
	
	return true;
}

async function fetchFoodData()  {
	let refreshStatus = await refreshToken();
	
	if(!refreshStatus)
	return;
	
	sendMessage('Fetching data...')
	
	let res = await fetch(getUpdateUrl(), {
	method: "GET",
	headers: {
		"Authorization": `Bearer ${tokens.access_token}`
	}
	});
	
	let data = await res.json();
	
	if(checkApiError(data))
	return;
	
	while(messaging.peerSocket.State !== messaging.peerSocket.OPEN) {
		console.log('closed')
	}
	
	messaging.peerSocket.send({
	type: 'food',
	calories: data.summary.calories,
	carbs: data.summary.carbs,
	fats: data.summary.fat,
	fiber: data.summary.fibers,
	proteins: data.summary.protein,
	sodium: data.summary.sodium,
	water: data.summary.water
	});
}


// Restore previously saved settings and send to the device
function getTokens() {
	let data = JSON.parse(settingsStorage.getItem("oauth"));
	
	console.log(JSON.stringify(data));
	
	if(data == null)
	return false;
	
	tokens = data;
	
	return true;
}

function sendMessage(msg) {
	console.log(`SendMessage: ${msg}`);
	
	if(messaging.peerSocket.readyState !== messaging.peerSocket.OPEN) {
		console.error(`PeerSocketState is ${messaging.peerSocket.readyState}, cannot send message!`);
		return;
	}
	
	console.log(`PeerSocketState is ${messaging.peerSocket.readyState}, sending message...`);
	
	messaging.peerSocket.send('a');
	return;

	messaging.peerSocket.send({
		msg: msg,
		type: 'food-msg'
	});
}

messaging.peerSocket.onopen = function() {
	console.log('Connection opened successfully (companion)');
}

messaging.peerSocket.onclose = function() {
	console.warn('Connection closed (companion)');
}

messaging.peerSocket.onerror = function(err) {
	console.error("Connection error: " + err.code + " - " + err.message);
}


messaging.peerSocket.onmessage = function(evt) {
	console.log(JSON.stringify(evt.data));
	
	if(evt.data !== "update-food") {
		return;
	}
	
	sendMessage('a');
	return;
	
	//sendMessage(`Request received (${util.getTime()})`);
	return;
	
	if (tokens == null) {
	if(!getTokens()) {
		console.warn('No token data from companion settings');
		sendMessage('1');
		return;
	}
	}

	fetchFoodData();
}

