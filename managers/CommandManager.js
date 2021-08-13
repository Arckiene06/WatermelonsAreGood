

import fs from "fs"

export default class ClientManager {
	constructor(client) {
		this.client = client
		this.commands = fs.readdirSync("managers/commands/").map(e => e.split(".js")[0])
		
	}


	async handleMessage(message) {
		const args = message.content.split(" ")
		let command = args.shift()
		
		if(command.startsWith(">")) command = command.substring(1); else return
		
		if(this.commands.includes(command)) {
			const nodeCommand = await import(`./commands/${command}.js`)
			const classCommand = new nodeCommand.default(this.client)

			classCommand.run(message, args)
		}
	}
}

