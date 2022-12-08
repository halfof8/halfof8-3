import { Vec2 } from 'ogl'
import normalizeWheel from 'normalize-wheel'

export class WheelControls {
	constructor({ elem, ease = 0.1, multiplier = { x: 1, y: 1 } }) {
		Object.assign(this, { elem, ease, multiplier })

		this.targetPos = new Vec2(0)
		this.currentPos = new Vec2(0)

		this.isEnabled = false
	}

	enable() {
		if (this.isEnabled) return
		this.elem.addEventListener('mousewheel', this._onMouseWheel)
	}

	disable() {
		if (!this.isEnabled) return
		this.elem.removeEventListener('mousewheel', this._onMouseWheel)
	}

	update() {
		this.currentPos.lerp(this.targetPos, this.ease)
	}

	_onMouseWheel = (e) => {
		const normalized = normalizeWheel(e)
		const axis = e.shiftKey ? 'x' : 'y'
		this.targetPos[axis] += normalized.pixelY * this.multiplier[axis]
		console.log(this.targetPos)
	}
}
