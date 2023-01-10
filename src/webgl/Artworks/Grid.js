import { Transform, Vec2, Vec3 } from 'ogl'
import { Cell } from './Celll.js'

export class Grid extends Transform {
	constructor({ renderingContext, gap, size, cellSize, pictures, cellLookAtZ, controls }) {
		super()
		Object.assign(this, { renderingContext, gap, size, cellSize, pictures, cellLookAtZ, controls })

		this.translateTarget = new Vec2(0)
		this.lastTranslate = new Vec2(0)
		this.translate = new Vec2(0)
		this.target = new Vec3(0, 0, cellLookAtZ)
		this.dimension = this._computeDimension()

		this.bounds = this._setupBounds()

		this.cells = this._makeCells()

		this.cells.forEach((cell, i) => {
			this.pictures[i].setParent(cell)
		})

		this.controls.on('change', this._onControlsChange)
	}

	update() {
		this.lastTranslate.copy(this.translate)
		this.translate.lerp(this.translateTarget, 0.05)

		if (this.translate.distance(this.translateTarget) < 0.25) {
			this.slideToCell(this.getClosestCell(0, 0))
		}

		this.cells.forEach((cell, i) => {
			cell.translate.copy(this.translate)
			cell.lookAt(this.target)
			cell.update()

			this.pictures[i].setOpacity(this._computeOpacity(cell))

			this._checkBounds(cell)
		})
	}

	setTranslate(vec2) {
		this.translate.copy(vec2)
	}

	setCellSize({ x, y }) {
		this.cellSize = { x, y }
	}

	getCell(x, y) {
		return this.cells.find((cell) => cell.index.x === x && cell.index.y === y)
	}

	getClosestCell(x, y) {
		const closest = this.cells.reduce(
			(acc, cell) => {
				const distance = new Vec2(x, y).distance(cell.position)
				if (distance < acc.distance) {
					acc.distance = distance
					acc.cell = cell
				}
				return acc
			},
			{ distance: Infinity, cell: null }
		)

		return closest.cell
	}

	slideToCell(cell) {
		this.translateTarget.x = this.translate.x - cell.position.x
		this.translateTarget.y = this.translate.y - cell.position.y
	}

	resize = () => {
		this.bounds = this._setupBounds()
		this._setDimension(this._computeDimension())
		this.cells.forEach(this._placeCell)
	}

	destroy() {
		this.controls.destroy()
	}

	setCellsLookAt(vec2) {
		this.target.x = vec2.x
		this.target.y = vec2.y
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
				cells.push(cell)
				this._placeCell(cell)
			}
		}
		return cells
	}

	_placeCell = (cell) => {
		const { x, y } = cell.index

		cell.offset
			.set(x * (this.cellSize.x + this.gap), y * (this.cellSize.y + this.gap))
			.scale(this.renderingContext.pxRatio)
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

	_computeOpacity(cell) {
		const opacity = 1 - cell.position.x ** 2 / (this.bounds.left * 2) ** 2
		return Math.max(Math.min(opacity, 1), 0)
	}

	_checkBounds(cell) {
		const cellWidth = this.cellSize.x * this.renderingContext.pxRatio
		const cellHeight = this.cellSize.y * this.renderingContext.pxRatio
		const gap = cellWidth * 0.1

		if (cell.position.x + cellWidth / 2 < this.bounds.left - gap) {
			cell.shift.x += 1
		}

		if (cell.position.x - cellWidth / 2 > this.bounds.right + gap) {
			cell.shift.x -= 1
		}

		if (cell.position.y + cellHeight / 2 < this.bounds.bottom - gap) {
			cell.shift.y += 1
		}

		if (cell.position.y - cellHeight / 2 > this.bounds.top + gap) {
			cell.shift.y -= 1
		}
	}

	_onControlsChange = (e) => {
		const { x, y } = e
		this.translateTarget.x -= x * this.renderingContext.pxRatio // or maybe invert in controls
		this.translateTarget.y += y * this.renderingContext.pxRatio
	}
}
