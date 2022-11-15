import { Vec2 } from 'ogl'

export class DragControls {
	constructor({ elem, ease = 0.1 }) {
		this.elem = elem
		this.ease = ease

		this.pointerStart = new Vec2(0)
		this.pointer = new Vec2(0)
		this.pointerDelta = new Vec2(0)

		this.lastPos = new Vec2(0)
		this.targetPos = new Vec2(0)
		this.currentPos = new Vec2(0)

		this.isEnabled = false
	}

	enable() {
		if (this.isEnabled) return
		this.elem.addEventListener('pointerdown', this._onPointerDown)
		this.elem.addEventListener('pointermove', this._onPointerMove)
		this.elem.addEventListener('pointerup', this._onPointerUp)
	}

	disable() {
		if (!this.isEnabled) return
		this.elem.removeEventListener('pointerdown', this._onPointerDown)
		this.elem.removeEventListener('pointermove', this._onPointerMove)
		this.elem.removeEventListener('pointerup', this._onPointerUp)
	}

	update() {
		this.currentPos.lerp(this.targetPos, this.ease)
	}

	_onPointerDown = (e) => {
		this.isDown = true

		this.pointerStart.set(e.clientX, -e.clientY)
	}

	_onPointerMove = (e) => {
		if (!this.isDown) return

		this.pointer.set(e.clientX, -e.clientY)
		this.pointerDelta.sub(this.pointer, this.pointerStart)

		this.targetPos.add(this.lastPos, this.pointerDelta)
	}

	_onPointerUp = () => {
		this.isDown = false
		this.lastPos.copy(this.targetPos)
	}
}
