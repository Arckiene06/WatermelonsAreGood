export default class command {
	constructor(client) {
		this.client = client
	}

	run() {
		this.client.sendMessage(`< ${this.client.user._id}`)
	}
}