import { EventEmitter } from "events"
import WebSocket from "ws"

import MidiManager from "./MidiManager.js"
import BanManager from "./BanManager.js"
import DVDManager from "./DVDManager.js"

export default class ClientManager extends EventEmitter {

	constructor(url, token) {
		super()

		this.url = url
		this.token = token
		this.users = new Map()
		this.midi = new MidiManager(this)
		this.bans = new BanManager(this)
		this.dvd = new DVDManager({})
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

			this.dvd.on("update", () => {
				if(!this.midi.player.isPlaying()) {
					this.sendPacket("m", {x: this.dvd.pos.x, y: this.dvd.pos.y})
				}
			})
	
			this.dvd.on("cornerHit", () => {
				if(!this.midi.player.isPlaying()) {
					this.sendMessage("< Corner hit!")
				}
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
				this.users = new Map()
				
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
			} else if(type == "custom") {
				console.log("Recieved a `custom` packet. Moving to channel " + packet.data.ch.ch._id)
				this.setChannel(packet.data.ch.ch._id)
			}
		})

		this.ws.on("close", (code, reason) => {
			this.emit("end", `${code} - ${reason}`)
		})

		this.ws.on("error", () => {
			this.emit("end", "Experienced error.")
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

