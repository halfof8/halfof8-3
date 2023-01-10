import EventEmitter from '../EventEmitter.js'

export class DragControls extends EventEmitter {
	constructor({ elem, multiplier = 0.1 }) {
		super()
		this.elem = elem
		this.multiplier = multiplier

		this.type = 'drag'

		this.pointerStart = { x: 0, y: 0 }
		this.pointer = { x: 0, y: 0 }
		this.pointerDelta = { x: 0, y: 0 }

		this.isEnabled = false
	}

	enable() {
		if (this.isEnabled) return
		this.isEnabled = true
		this.elem.addEventListener('pointerdown', this._onPointerDown)
		this.elem.addEventListener('pointermove', this._onPointerMove)
		this.elem.addEventListener('pointerup', this._onPointerUp)
		this.elem.addEventListener('pointerout', this._onPointerUp)
	}

	disable() {
		if (!this.isEnabled) return
		this.isEnabled = false
		this.elem.removeEventListener('pointerdown', this._onPointerDown)
		this.elem.removeEventListener('pointermove', this._onPointerMove)
		this.elem.removeEventListener('pointerup', this._onPointerUp)
		this.elem.removeEventListener('pointerout', this._onPointerUp)
	}

	destroy() {
		super.destroy()
	}

	_onPointerDown = (e) => {
		this.isDown = true

		this.pointerStart.x = e.clientX
		this.pointerStart.y = -e.clientY
	}

	_onPointerMove = (e) => {
		if (!this.isDown) return

		this.pointer.x = e.clientX
		this.pointer.y = -e.clientY

		this.pointerDelta.x = this.pointer.x - this.pointerStart.x
		this.pointerDelta.y = this.pointer.y - this.pointerStart.y

		const x = -this.pointerDelta.x * this.multiplier
		const y = this.pointerDelta.y * this.multiplier

		this.emit('change', { x, y, type: this.type })
	}

	_onPointerUp = () => {
		this.isDown = false
	}
}
