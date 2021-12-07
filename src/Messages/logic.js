const axios = require('axios');

export async function receiveMessage(url_receive_ms, message) {
	let response = await axios.post(url_receive_ms)
	return response.data
}

