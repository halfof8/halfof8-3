import { Transform, Vec2, Vec3 } from 'ogl'
import { Square } from './scene/Square.js'

export class Cell extends Transform {
	constructor({ translate, dimension }) {
		super()
		Object.assign(this, { translate, dimension })

		this.offset = new Vec2(0)
		this.shift = new Vec2(0)
	}

	update() {
		this.position.x = this.offset.x + this.translate.x + this.shift.x * this.dimension.x
		this.position.y = this.offset.y + this.translate.y + this.shift.y * this.dimension.y
	}
}

export class Grid {
	constructor({ gl, gap, translate, scene, bounds, size, cellSize }) {
		Object.assign(this, { gl, gap, translate, scene, bounds, size, cellSize })

		// todo parallax
		this.parallaxSpeed = 0.1
		this.parallaxState = 0
		this.uniqueParallaxCount = 4

		this.cells = []
		this.dimension = new Vec2()

		this._computeDimension()
		this._makeCells()
	}

	update() {
		this.traverse((cell, index) => {
			cell.update()
			this._checkBounds(cell)

			const columnNumber = Math.floor(index / this.size.y)
		})
	}

	traverse(fn) {
		this.cells.forEach((cell, index) => {
			fn(cell, index)
		})
	}

	setCellSize(x, y) {
		this.cellSize.set(x, y)
		this.placeCells()
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
					gl: this.gl,
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
			// console.log('right')
		}

		if (cell.position.x - this.cellSize.x / 2 > this.bounds.right) {
			cell.shift.x -= 1
			// console.log('left')
		}

		if (cell.position.y + this.cellSize.y / 2 < this.bounds.bottom) {
			cell.shift.y += 1
			// console.log('top')
		}

		if (cell.position.y - this.cellSize.y / 2 > this.bounds.top) {
			cell.shift.y -= 1
			// console.log('bottom')
		}
	}
}
