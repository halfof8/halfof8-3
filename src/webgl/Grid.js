import { Transform, Vec2 } from 'ogl'

export class Cell extends Transform {
	constructor({ index, dimension }) {
		super()
		Object.assign(this, { index, dimension })

		this.translate = new Vec2(0)
		this.offset = new Vec2(0)
		this.shift = new Vec2(0)
	}

	update() {
		this.position.x = this.offset.x + this.translate.x + this.shift.x * this.dimension.x
		this.position.y = this.offset.y + this.translate.y + this.shift.y * this.dimension.y
	}
}

export class Grid {
	constructor({ gl, gap, scene, bounds, size, cellSize }) {
		Object.assign(this, { gl, gap, scene, bounds, size, cellSize })

		this.parallaxSpeed = 0.2
		this.parallaxState = 0

		this.cells = []
		this.dimension = new Vec2(0)
		this.translate = new Vec2(0)

		this._computeDimension()
		this._makeCells()
	}

	update() {
		this.parallaxState = this.translate.y * this.parallaxSpeed

		this.traverse((cell) => {
			cell.translate.copy(this.translate)
			cell.translate.y += this.parallaxState * (cell.index.x / this.size.x)
			cell.update()

			this._checkBounds(cell)
		})
	}

	traverse(fn) {
		this.cells.forEach((cell, index) => {
			fn(cell, index)
		})
	}

	setTranslate(vec2) {
		this.translate.copy(vec2)
	}

	setCellSize(x, y) {
		this.cellSize.set(x, y)
		this._computeDimension()
	}

	placeCells() {
		this.traverse((cell) => {
			cell.offset.set(cell.index.x * (this.cellSize.x + this.gap), cell.index.y * (this.cellSize.y + this.gap))
		})
	}

	_makeCells() {
		for (let i = 0; i < this.size.x; i++) {
			for (let j = 0; j < this.size.y; j++) {
				const cell = new Cell({
					index: { x: i, y: j },
					translate: this.translate,
					dimension: this.dimension
				})
				cell.setParent(this.scene)
				cell.offset.set(i * (this.cellSize.x + this.gap), j * (this.cellSize.y + this.gap))

				this.cells.push(cell)
			}
		}
	}

	_computeDimension() {
		this.dimension.x = this.size.x * (this.cellSize.x + this.gap)
		this.dimension.y = this.size.y * (this.cellSize.y + this.gap)
	}

	_checkBounds(cell) {
		if (cell.position.x + this.cellSize.x / 2 < this.bounds.left) {
			cell.shift.x += 1
		}

		if (cell.position.x - this.cellSize.x / 2 > this.bounds.right) {
			cell.shift.x -= 1
		}

		if (cell.position.y + this.cellSize.y / 2 < this.bounds.bottom) {
			cell.shift.y += 1
		}

		if (cell.position.y - this.cellSize.y / 2 > this.bounds.top) {
			cell.shift.y -= 1
		}
	}
}
