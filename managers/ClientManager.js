import { EventEmitter } from "events"
import WebSocket from "ws"

import MidiManager from "./MidiManager.js"
import BanManager from "./BanManager.js"

export default class ClientManager extends EventEmitter {

	constructor(url, token) {
		super()

		this.url = url
		this.token = token
		this.users = new Map()
		this.midi = new MidiManager(this)
		this.bans = new BanManager(this)
		this.ws = new WebSocket(this.url)

		this.ws.on("open", () => {
			setInterval(() => {
				this.sendPacket("t", {
					e: Date.now()
				})
			}, 15000)
			
			this.sendPacket("hi", {
				token: this.token,
			})
		})

		this.ws.on("message", message => {
			let packet
			try {
				packet = JSON.parse(message.toString())[0]
			} catch {
				return
			}

			const type = packet.m
			

			if(type == "hi") {
				this.user = packet.u
				this.emit("ready")
			} else if(type == "a") {
				this.emit("message", {
					content: packet.a,
					user: packet.p
				})
			} else if(type == "ch") {
				packet.ppl.forEach(u => {
					this.users.set(u._id, u)
					if(this.bans.bans.includes(u._id)) 
						this.bans.sendKickban(u._id)
				})
			} else if(type == "p") {
				this.users.set(packet._id, packet)
				if(this.bans.bans.includes(packet._id))
					this.bans.sendKickban(packet._id)
			} else if(type == "bye") {
				this.users.delete(packet.ps)
			}
		})


	}

	setChannel(_id) {
		this.sendPacket("ch", {
			_id,
			set: {
				visible: true
			}
		})
	}

	sendMessage(message) {
		this.sendPacket("a", {
			message,
		})
	}
	
	sendPacket(m, packet) {
		this.ws.send(JSON.stringify([{
			m,
			...packet
		}]))
	}

}
