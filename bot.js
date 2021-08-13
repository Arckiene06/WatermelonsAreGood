import ClientManager from "./managers/ClientManager.js"
import CommandManager from "./managers/CommandManager.js"
import fs from "fs"

const config = JSON.parse(fs.readFileSync("config.json"))

const client = new ClientManager(config.ws, config.token)
const CManager = new CommandManager(client)

client.on("ready", () => {
	client.setChannel(config.channel)

	console.log("I have connected.")
})

client.on("message", message => {
	if(message.user._id == (config.owner || client.user._id)) {
		CManager.handleMessage(message)
		return
	} 
})