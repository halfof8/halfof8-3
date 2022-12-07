import { Transform, Vec2 } from 'ogl'

class SpaceItem {
	constructor({ mesh, gap, bounds, fullWidth, fullHeight }) {
		Object.assign(this, { mesh, gap, bounds, fullWidth, fullHeight })

		this.translate = new Vec2(0)
		this.offset = new Vec2(0)
		this.extra = new Vec2(0)

		this.cell = new Transform()
	}

	place({ x, y }) {
		this.offset.x = x * (this.cell.position.x + this.gap)
		this.offset.y = -y * (this.cell.position.y + this.gap)

		this.update()
	}

	setBounds(bounds) {
		this.bounds = bounds
	}

	setParams({ gap, fullWidth, fullHeight }) {
		this.gap = gap
		this.fullWidth = fullWidth
		this.fullHeight = fullHeight
	}

	update() {
		this._checkBounds()
		this.cell.position.x = this.offset.x + this.translate.x + this.extra.x * this.fullWidth
		this.cell.position.y = this.offset.y + this.translate.y + this.extra.y * this.fullHeight
		this.mesh.position.copy(this.cell.position)
	}

	_checkBounds() {
		if (this.cell.position.x + this.cell.scale.x / 2 < this.bounds.left) {
			this.extra.x += 1
		}

		if (this.cell.position.x - this.cell.scale.x / 2 > this.bounds.right) {
			this.extra.x -= 1
		}

		if (this.cell.position.y + this.cell.scale.y / 2 < this.bounds.bottom) {
			this.extra.y += 1
		}

		if (this.cell.position.y - this.cell.scale.y / 2 > this.bounds.top) {
			this.extra.y -= 1
		}
	}
}

export class Space {
	constructor({ meshes, gap = 0, viewport, rowCount, columnCount, itemWidth, itemHeight }) {
		Object.assign(this, { meshes, gap, viewport, rowCount, columnCount, itemWidth, itemHeight })

		this.parallaxSpeed = 0.1
		this.parallaxState = 0
		this.uniqueParallaxCount = 4

		this.lastTranslate = new Vec2(0)
		this.direction = new Vec2(0)

		this._setupSpaceSize()

		this.items = this.meshes.map((mesh) => {
			return new SpaceItem({
				mesh,
				gap: this.gap,
				bounds: this.bounds,
				fullWidth: this.spaceWidth,
				fullHeight: this.spaceHeight
			})
		})

		this._setupBounds()
		this.place()
	}

	update() {
		this.items.forEach((item) => {
			item.update()
		})
	}

	resize() {
		this._setupBounds()
		this.place()
	}

	place() {
		this.items.forEach((item, index) => {
			const columnNumber = Math.floor(index / this.rowCount)
			const rowNumber = index % this.rowCount
			item.place({ x: columnNumber, y: rowNumber })
		})
	}

	setTranslate(vec2) {
		this.direction.sub(vec2, this.lastTranslate)
		this.lastTranslate.copy(vec2)

		this.parallaxState += this.direction.y

		this.items.forEach((item, index) => {
			const columnNumber = Math.floor(index / this.rowCount)

			item.translate.copy(vec2)
			item.translate.y += this.parallaxState * this.parallaxSpeed * (columnNumber % this.uniqueParallaxCount)
		})
	}

	setParams({ gap = this.gap, itemWidth = this.itemWidth, itemHeight = this.itemHeight }) {
		this.gap = gap

		this.itemWidth = itemWidth
		this.itemHeight = itemHeight
		this._setupSpaceSize()

		this.items.forEach((item) => {
			item.setParams({
				gap: this.gap,
				fullWidth: this.spaceWidth,
				fullHeight: this.spaceHeight
			})
		})

		return this
	}

	_setupBounds = () => {
		this.bounds = {
			top: this.viewport.height / 2,
			right: this.viewport.width / 2,
			bottom: -this.viewport.height / 2,
			left: -this.viewport.width / 2
		}

		this.items.forEach((item) => {
			item.setBounds(this.bounds)
		})
	}

	_setupSpaceSize() {
		this.spaceWidth = this.columnCount * (this.itemWidth + this.gap)
		this.spaceHeight = this.rowCount * (this.itemHeight + this.gap)
	}
}
