import normalizeWheel from 'normalize-wheel'
import EventEmitter from '../EventEmitter.js'

export class WheelControls extends EventEmitter {
	constructor({ elem, multiplier = 0.1 }) {
		super()
		Object.assign(this, { elem, multiplier })

		this.type = 'wheel'
		this.isEnabled = false
	}

	enable() {
		if (this.isEnabled) return
		this.isEnabled = true
		this.elem.addEventListener('wheel', this._onWheel)
	}

	disable() {
		if (!this.isEnabled) return
		this.isEnabled = false
		this.elem.removeEventListener('wheel', this._onWheel)
	}

	destroy() {
		super.destroy()
	}

	_onWheel = (e) => {
		const normalized = normalizeWheel(e)

		let x
		let y

		if (e.shiftKey) {
			x = normalized.pixelY * this.multiplier
			y = normalized.pixelX * this.multiplier
		} else {
			x = normalized.pixelX * this.multiplier
			y = normalized.pixelY * this.multiplier
		}

		this.emit('change', { x, y, type: this.type })
	}
}
