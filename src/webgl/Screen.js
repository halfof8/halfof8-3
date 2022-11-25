export class Screen {
	constructor() {
		this.resize()
	}

	resize() {
		this.width = window.innerWidth
		this.height = window.innerHeight
	}
}
