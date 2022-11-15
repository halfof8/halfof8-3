export class UnitConverter {
	constructor({ camera, width = 1, height = 1 }) {
		this.camera = camera
		this.screen = { width, height }
		this.viewport = {}

		this.resize()
	}

	resize() {
		const fov = this.camera.fov * (Math.PI / 180)
		this.viewport.height = 2 * Math.tan(fov / 2) * this.camera.position.z
		this.viewport.width = this.viewport.height * this.camera.aspect

		this.pxUnitRatio = this.viewport.height / this.screen.height
	}

	setScreenSize(width, height) {
		this.screen.width = width
		this.screen.height = height
		this.resize()
	}

	getViewportSize() {
		return { width: this.viewport.width, height: this.viewport.height }
	}

	pxToUnit(value) {
		return value * this.pxUnitRatio
	}

	unitToPx(value) {
		return value / this.pxUnitRatio
	}
}
