import { settingsStorage } from "settings";


export var tokens = null;


function getFromCompanion() {
    let data = JSON.parse(settingsStorage.getItem("oauth"));
    
    console.log(data);
	
	if(data == null)
		return false;
	
	tokens = data;
	
	return true;
}

export async function refresh(message_cb) {
    if(tokens == null)
	{
		console.log('No token on device, checking companion...')
		let status = getFromCompanion();

		if(!status) {
            console.error('No tokens on companion. Manually request a new token');
            message_cb('Manually request token from companion');
			return false;
		}
	}

	message_cb('Refreshing Token...');
		
	let res = await fetch('https://api.fitbit.com/oauth2/token', {
		method: "POST",
		headers: {
			'Authorization': `Basic ${btoa('22BB79:e9973a9a5e5fef8367d4c00285a3d290')}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: `grant_type=refresh_token&refresh_token=${tokens.refresh_token}`
	});
	
	let data = await res.json();
	if(checkApiError(data, message_cb))
		return false;
	
	tokens = data;

	console.log(`New token: ${tokens.access_token}`);
	
	return true;
}

function checkApiError(data, message_cb) {
	if(data.success === undefined || data.success === true)
		return false;
	
	console.error(JSON.stringify(data));

	data.errors.forEach(e => {
	console.error(e.message);

	switch(e.errorType) {
		case 'expired_token':
            message_cb('Access token expired');
		    break;
		case 'invalid_token':
            message_cb('Invalid access token');
            tokens = null;
            break;
		case 'invalid_grant':
            message_cb('Invalid refresh token');
            tokens = null;
            break;
		default:
            message_cb(e.message);
		    break;
	}
	});
	
	return true;
}

// Event fires when a setting is changed
settingsStorage.onchange = function(evt) {
    if(evt.key !== 'oauth')
        return;
        
    tokens = evt.newValue;
}
