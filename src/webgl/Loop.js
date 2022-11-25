export class Loop {
	constructor(fn) {
		this.fn = fn
		this._loopId = null
		this._loop = this._loop.bind(this)
	}

	start() {
		if (this._loopId) return
		this._loopId = requestAnimationFrame(this._loop)
	}

	stop() {
		if (!this._loopId) return
		cancelAnimationFrame(this._loopId)
		this._loopId = null
	}

	_loop() {
		this._loopId = requestAnimationFrame(this._loop)
		this.fn()
	}
}
