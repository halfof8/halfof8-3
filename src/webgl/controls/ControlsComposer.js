import EventEmitter from '../EventEmitter.js'

export class ControlsComposer extends EventEmitter {
	constructor(controls) {
		super()
		this.controls = controls
		this.controls.forEach((controls) => {
			controls.on('change', this._onChange)
		})
	}

	enable() {
		this.controls.forEach((controls) => controls.enable())
	}

	disable() {
		this.controls.forEach((controls) => controls.disable())
	}

	destroy() {
		this.controls.forEach((controls) => controls.destroy())
		super.destroy()
	}

	_onChange = (e) => {
		this.emit('change', e)
	}
}
