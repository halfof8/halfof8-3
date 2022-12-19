import { Transform, Vec2 } from 'ogl'
import { Cell } from './Celll.js'

export class Grid extends Transform {
	constructor({ renderingContext, gap, size, cellSize, pictures }) {
		super()
		Object.assign(this, { renderingContext, gap, size, cellSize, pictures })

		this.parallaxSpeed = 0.4
		this.parallaxState = 0

		this.translate = new Vec2(0)
		this.dimension = this._computeDimension()

		this.bounds = this._setupBounds()

		this.cells = this._makeCells()

		this.cells.forEach((cell, i) => {
			this.pictures[i].setParent(cell)
		})
	}

	update() {
		this.parallaxState = this.translate.y * this.parallaxSpeed

		this.cells.forEach((cell) => {
			cell.translate.copy(this.translate)
			cell.translate.y += this.parallaxState * (cell.index.x / this.size.x)
			cell.update()

			this._checkBounds(cell)
		})
	}

	setTranslate(vec2) {
		this.translate.copy(vec2)
	}

	setCellSize({ x, y }) {
		this.cellSize = { x, y }
	}

	resize = () => {
		this.bounds = this._setupBounds()
		this._setDimension(this._computeDimension())
		this.cells.forEach((cell) => {
			cell.offset
				.set(cell.index.x * (this.cellSize.x + this.gap), cell.index.y * (this.cellSize.y + this.gap))
				.scale(this.renderingContext.pxRatio)
		})
	}

	_makeCells() {
		const cells = []
		for (let i = 0; i < this.size.x; i++) {
			for (let j = 0; j < this.size.y; j++) {
				const cell = new Cell({
					index: { x: i, y: j },
					translate: this.translate,
					dimension: this.dimension
				})
				cell.setParent(this)
				cell.offset
					.set(i * (this.cellSize.x + this.gap), j * (this.cellSize.y + this.gap))
					.scale(this.renderingContext.pxRatio)

				cells.push(cell)
			}
		}
		return cells
	}

	_computeDimension() {
		return new Vec2(this.size.x * (this.cellSize.x + this.gap), this.size.y * (this.cellSize.y + this.gap)).scale(
			this.renderingContext.pxRatio
		)
	}

	_setDimension(vec2) {
		this.dimension.x = vec2.x
		this.dimension.y = vec2.y
	}

	_setupBounds() {
		const vh = window.innerHeight * this.renderingContext.pxRatio
		const vw = window.innerWidth * this.renderingContext.pxRatio

		return {
			top: vh / 2,
			right: vw / 2,
			bottom: -vh / 2,
			left: -vw / 2
		}
	}

	_checkBounds(cell) {
		const cellWidth = this.cellSize.x * this.renderingContext.pxRatio
		const cellHeight = this.cellSize.y * this.renderingContext.pxRatio

		if (cell.position.x + cellWidth / 2 < this.bounds.left) {
			cell.shift.x += 1
		}

		if (cell.position.x - cellWidth / 2 > this.bounds.right) {
			cell.shift.x -= 1
		}

		if (cell.position.y + cellHeight / 2 < this.bounds.bottom) {
			cell.shift.y += 1
		}

		if (cell.position.y - cellHeight / 2 > this.bounds.top) {
			cell.shift.y -= 1
		}
	}
}
