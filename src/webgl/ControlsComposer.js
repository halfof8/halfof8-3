import { Vec2 } from 'ogl'

export class ControlsComposer {
	constructor(controls) {
		this.controls = controls

		this.currentPos = new Vec2()
	}

	update() {
		this.currentPos.x = 0
		this.currentPos.y = 0

		this.controls.forEach((controls) => {
			controls.update()
			this.currentPos.x += controls.currentPos.x
			this.currentPos.y += controls.currentPos.y
		})
	}

	enable() {
		this.controls.forEach((controls) => controls.enable())
	}

	disable() {
		this.controls.forEach((controls) => controls.disable())
	}
}
