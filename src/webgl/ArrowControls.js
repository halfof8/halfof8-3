import { Vec2 } from 'ogl'

const KEY_UP = 'ArrowUp'
const KEY_RIGHT = 'ArrowRight'
const KEY_DOWN = 'ArrowDown'
const KEY_LEFT = 'ArrowLeft'
const KEYS = [KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_LEFT]

export class ArrowControls {
	constructor({ elem, ease = 0.1, amount = { x: 100, y: 100 } }) {
		Object.assign(this, { elem, ease, amount })

		this.targetPos = new Vec2(0)
		this.currentPos = new Vec2(0)

		this.isEnabled = false
	}

	enable() {
		if (this.isEnabled) return
		this.elem.addEventListener('keydown', this._onKeyDown)
	}

	disable() {
		if (!this.isEnabled) return
		this.elem.removeEventListener('keydown', this._onKeyDown)
	}

	update() {
		this.currentPos.lerp(this.targetPos, this.ease)
	}

	_onKeyDown = (e) => {
		const { code } = e
		if (!KEYS.includes(code)) return

		const axis = code === KEY_LEFT || code === KEY_RIGHT ? 'x' : 'y'
		const multiplier = code === KEY_RIGHT || code === KEY_UP ? -1 : 1
		this.targetPos[axis] += this.amount[axis] * multiplier
	}
}
