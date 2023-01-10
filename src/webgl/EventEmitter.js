export default class EventEmitter {
	constructor() {
		this.events = {}
	}

	on(type, fn) {
		if (!this.events[type]) this.events[type] = []
		this.events[type].push(fn)
	}

	emit(type, eventData) {
		if (this.events[type]) this.events[type].forEach((fn) => fn.call(null, eventData))
	}

	off(type, fn) {
		if (this.events[type]) this.events[type] = this.events[type].filter((func) => func !== fn)
	}

	destroy() {
		this.events = {}
	}
}
