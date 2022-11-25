import EventEmitter from './EventEmitter.js'

export class Viewport extends EventEmitter {
	constructor({ camera }) {
		super()

		Object.assign(this, { camera })

		this.resize()
	}

	resize() {
		const fov = this.camera.fov * (Math.PI / 180)
		this.height = 2 * Math.tan(fov / 2) * this.camera.position.z
		this.width = this.height * this.camera.aspect
		this.emit('resize')
	}
}
