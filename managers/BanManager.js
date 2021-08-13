import fs from "fs"

export default class BanManager {
	constructor(client) {
		this.client = client

		if(!fs.existsSync("bans.array")) {
			fs.appendFileSync("bans.array", "[]")
		}

		this.bans = JSON.parse(fs.readFileSync("bans.array"))
	}

	async ban(id) {
		if(!this.bans.includes(id)) {
			this.bans.push(id)

			fs.writeFileSync("bans.array", JSON.stringify(this.bans))

			if(this.client.users.has(id)) {
				this.sendKickban(id)
			}

			return `User ${id} was banned.`
		} else {
			return `User ${id} is already banned.`
		}
	}
	
	
	async unban(id) {
		if(this.bans.includes(id)) {
			this.bans = this.bans.filter(e => e != id)

			fs.writeFileSync("bans.array", JSON.stringify(this.bans))
			return `User ${id} has been unbanned..`
		} else {
			return `User ${id} is not banned.`
		}
	}

	async sendKickban(id) {
		this.client.sendPacket("kickban", {
			_id: id,
			ms: 3600000
		})
	}
}

