import EventEmitter from "events"

export default class DVDManager extends EventEmitter {
	constructor(stats) {
		super()
		this.pos = {
			x: 50,
			y: 50
		}
		this.vel = {
			x: 2 / 9,
			y: 2 / 12
		}
		this.stats = stats
		setInterval(() => {
			this.update()
		}, 25)
	}

	update() {
		var pos = this.pos
		var vel = this.vel
		pos.x += vel.x
		pos.y += vel.y
		if ((pos.x >= 100 && vel.x > 0) || (pos.x <= 0 && vel.x < 0)) {
			vel.x = -vel.x
			this.stats.w += 1
			this.emit("save")
		}
		if ((pos.y >= 100 && vel.y > 0) || (pos.y <= 0 && vel.y < 0)) {
			vel.y = -vel.y
			this.stats.w += 1
			
			this.emit("save")
		}
		if ((pos.x <= 0 && pos.y <= 0) || (pos.x >= 100 && pos.y <= 0) || (pos.x >= 100 && pos.y >= 100) || (pos.x <= 0 && pos.y >= 100)) {
			this.stats.c += 1

			this.emit("cornerHit")
			this.emit("save")
		}
		
		this.emit("update")
	}
}