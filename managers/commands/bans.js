export default class command {
	constructor(client) {
		this.client = client
	}

	async run() {
		this.client.sendMessage(`There are currently ${this.client.bans.bans.length} logged bans.`)
	}
}