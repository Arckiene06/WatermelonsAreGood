export default class command {
	constructor(client) {
		this.client = client
	}

	async run(message, args) {
		this.client.sendMessage(`< ${await this.client.bans.ban(args[0])}`)
	}
}