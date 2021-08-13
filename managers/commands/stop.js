export default class command {
	constructor(client) {
		this.client = client
	}

	run() {
		this.client.midi.stop()
	}
}