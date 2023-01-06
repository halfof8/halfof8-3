import { Vec2 } from 'ogl'
import EventEmitter from './EventEmitter.js'

export class MouseControls extends EventEmitter {
	constructor({ element, ease = 0.05 }) {
		super()
		this.element = element
		this.ease = ease

		this.isEnabled = false

		this.currentPos = new Vec2()
		this.targetPos = new Vec2()
	}

	enable() {
		if (this.isEnabled) return
		this.isEnabled = true
		this.element.addEventListener('pointermove', this._onPointerMove)
	}

	disable() {
		if (!this.isEnabled) return
		this.isEnabled = false
	}

	update() {
		this.currentPos.lerp(this.targetPos, this.ease)
	}

	_onPointerMove = (e) => {
		this.targetPos.set(2.0 * (e.x / this.element.width) - 1.0, 2.0 * (1.0 - e.y / this.element.height) - 1.0)
	}
}
