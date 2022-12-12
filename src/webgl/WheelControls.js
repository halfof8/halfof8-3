import { Vec2 } from 'ogl'
import normalizeWheel from 'normalize-wheel'

export class WheelControls {
	constructor({ elem, ease = 0.1, multiplier = 0.5 }) {
		Object.assign(this, { elem, ease, multiplier })

		this.targetPos = new Vec2(0)
		this.currentPos = new Vec2(0)

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

	update() {
		this.currentPos.lerp(this.targetPos, this.ease)
	}

	_onWheel = (e) => {
		const normalized = normalizeWheel(e)

		this.targetPos.x -= normalized.pixelX * 0.1
		if (e.shiftKey) {
			this.targetPos.x -= normalized.pixelY * 0.1
		} else {
			this.targetPos.y += normalized.pixelY * 0.1
		}
	}
}
