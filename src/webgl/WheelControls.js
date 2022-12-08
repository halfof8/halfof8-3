import { Vec2 } from 'ogl'

export class WheelControls {
	constructor({ elem, ease = 0.1, amount = { x: 100, y: 100 } }) {
		Object.assign(this, { elem, ease, amount })

		this.targetPos = new Vec2(0)
		this.currentPos = new Vec2(0)

		this.isEnabled = false
	}

	enable() {
		if (this.isEnabled) return
		this.elem.addEventListener('wheel', this._onWheel)
	}

	disable() {
		if (!this.isEnabled) return
		this.elem.removeEventListener('wheel', this._onWheel)
	}

	update() {
		this.currentPos.lerp(this.targetPos, this.ease)
	}

	_onWheel = (e) => {
		const axis = e.shiftKey ? 'x' : 'y'
		const multiplier = axis === 'y' ? Math.sign(e.deltaY) : -Math.sign(e.deltaY)
		this.targetPos[axis] += this.amount[axis] * multiplier
	}
}
