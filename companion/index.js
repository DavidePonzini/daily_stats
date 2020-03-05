import * as messaging from "messaging";
import * as token from "./token";


async function fetchFoodData()  {
	let refreshStatus = await token.refresh(sendMessage);
	
	if(!refreshStatus) {
		return;
	}
	
	sendMessage('Fetching data...');
	
	let res = await fetch(getUpdateUrl(), {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${token.tokens.access_token}`
		}
	});

	let data = await res.json();
	
	if(checkApiError(data))
		return;
	
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


function getUpdateUrl() {
	let date = new Date();
	let todayDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; //YYYY-MM-DD
	
	let url = `https://api.fitbit.com/1/user/-/foods/log/date/${todayDate}.json`;

	console.log(url);

	return url;
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
		break;
		case 'invalid_grant':
		sendMessage('Invalid refresh token');
		break;
		default:
		sendMessage(e.message);
		break;
	}
	});
	
	return true;
}


function sendMessage(msg) {
	console.log(`SendMessage: ${msg}`);
	
	if(messaging.peerSocket.readyState !== messaging.peerSocket.OPEN) {
		console.error(`PeerSocketState is ${messaging.peerSocket.readyState}, cannot send message!`);
		return;
	}
	
	// console.log(`PeerSocketState is ${messaging.peerSocket.readyState}, sending message...`);
	
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
	if(evt.data !== "update-food") {
		return;
	}

	fetchFoodData();
}

