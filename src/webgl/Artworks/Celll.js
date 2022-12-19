import { Transform, Vec2 } from 'ogl'

export class Cell extends Transform {
	constructor({ index, dimension }) {
		super()
		Object.assign(this, { index, dimension })

		this.translate = new Vec2(0)
		this.offset = new Vec2(0)
		this.shift = new Vec2(0)
	}

	update() {
		this.position.x = this.offset.x + this.translate.x + this.shift.x * this.dimension.x
		this.position.y = this.offset.y + this.translate.y + this.shift.y * this.dimension.y
	}
}
