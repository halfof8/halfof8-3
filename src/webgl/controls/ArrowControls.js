import EventEmitter from '../EventEmitter.js'

const KEY_UP = 'ArrowUp'
const KEY_RIGHT = 'ArrowRight'
const KEY_DOWN = 'ArrowDown'
const KEY_LEFT = 'ArrowLeft'
const KEYS = [KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_LEFT]

export class ArrowControls extends EventEmitter {
	constructor({ elem, multiplier = 0.5 }) {
		super()
		Object.assign(this, { elem, multiplier })

		this.type = 'keyboard'
		this.isEnabled = false
	}

	enable() {
		if (this.isEnabled) return
		this.isEnabled = true
		this.elem.addEventListener('keydown', this._onKeyDown)
	}

	disable() {
		if (!this.isEnabled) return
		this.isEnabled = false
		this.elem.removeEventListener('keydown', this._onKeyDown)
	}

	update() {
		this.currentPos.lerp(this.targetPos, this.ease)
	}

	_onKeyDown = (e) => {
		const { code } = e
		if (!KEYS.includes(code)) return

		// todo

		const axis = code === KEY_LEFT || code === KEY_RIGHT ? 'x' : 'y'
		const direction = code === KEY_RIGHT || code === KEY_UP ? -1 : 1

		const x = 100 * direction * this.multiplier
		const y = 100 * direction * this.multiplier

		this.emit('move', { x, y, type: this.type })
	}
}
