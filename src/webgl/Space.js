import { Vec2 } from 'ogl'

class SpaceItem {
	constructor({ mesh, gap, bounds, fullWidth, fullHeight }) {
		Object.assign(this, { mesh, gap, bounds, fullWidth, fullHeight })

		this.translate = new Vec2(0)
		this.offset = new Vec2(0)
		this.extra = new Vec2(0)
	}

	place({ x, y }) {
		this.offset.x = x * (this.mesh.scale.x + this.gap)
		this.offset.y = -y * (this.mesh.scale.y + this.gap)

		this.update()
	}

	setTranslate(vec2) {
		this.translate.copy(vec2)
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
		this.mesh.position.x = this.offset.x + this.translate.x + this.extra.x * this.fullWidth
		this.mesh.position.y = this.offset.y + this.translate.y + this.extra.y * this.fullHeight
	}

	_checkBounds() {
		if (this.mesh.position.x + this.mesh.scale.x / 2 < this.bounds.left) {
			this.extra.x += 1
		}

		if (this.mesh.position.x - this.mesh.scale.x / 2 > this.bounds.right) {
			this.extra.x -= 1
		}

		if (this.mesh.position.y + this.mesh.scale.y / 2 < this.bounds.bottom) {
			this.extra.y += 1
		}

		if (this.mesh.position.y - this.mesh.scale.y / 2 > this.bounds.top) {
			this.extra.y -= 1
		}
	}
}

export class Space {
	constructor({ meshes, gap = 0, viewport, itemWidth, itemHeight }) {
		Object.assign(this, { meshes, gap, viewport, itemWidth, itemHeight })

		this.itemsInColumn = 4
		this.columnCount = Math.ceil(this.meshes.length / this.itemsInColumn)

		this.translate = new Vec2(0)
		this.lastTranslate = new Vec2(0)

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
			const rowNumber = Math.floor(index / this.itemsInColumn)
			const columnNumber = index % this.itemsInColumn
			item.place({ x: rowNumber - 2, y: columnNumber - 1 })
		})
	}

	setTranslate(vec2) {
		this.lastTranslate.copy(this.translate)
		this.translate.copy(vec2)
		this.items.forEach((item) => {
			item.setTranslate(this.translate)
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
		this.spaceHeight = this.itemsInColumn * (this.itemHeight + this.gap)
	}
}
