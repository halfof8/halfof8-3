export class UnitConverter {
	constructor({ screen, viewport }) {
		Object.assign(this, { screen, viewport })
	}

	resize() {
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

	getScreenSize() {
		return { width: this.screen.width, height: this.screen.height }
	}

	pxToUnit(value) {
		return value * this.pxUnitRatio
	}

	unitToPx(value) {
		return value / this.pxUnitRatio
	}
}
