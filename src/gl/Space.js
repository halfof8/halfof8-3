import { Vec2 } from 'ogl'

class SpaceItem {
	constructor({ mesh, gap, bounds, fullWidth, fullHeight }) {
		Object.assign(this, { mesh, gap, bounds, fullWidth, fullHeight })

		this.translate = new Vec2(0)
		this.offset = new Vec2(0)
		this.extra = new Vec2(0)

		this.direction = new Vec2(0)
	}

	place({ x, y }) {
		const scale = this.mesh.scale

		this.offset.x = x * (scale.x + this.gap)
		this.offset.y = -y * (scale.y + this.gap)

		this.update()
	}

	setTranslate(vec2, direction) {
		this.translate.copy(vec2)
		this.direction.copy(direction)
	}

	setBounds(bounds) {
		this.bounds = bounds
	}

	update() {
		this._checkBounds()
		this.mesh.position.x = this.offset.x + this.translate.x + this.extra.x
		this.mesh.position.y = this.offset.y + this.translate.y + this.extra.y
	}

	_checkBounds() {
		if (this.direction.x < 0 && this.mesh.position.x + this.mesh.scale.x / 2 < this.bounds.left) {
			this.extra.x += this.fullWidth
		}

		if (this.direction.x > 0 && this.mesh.position.x - this.mesh.scale.x / 2 > this.bounds.right) {
			this.extra.x -= this.fullWidth
		}

		if (this.direction.y < 0 && this.mesh.position.y + this.mesh.scale.y / 2 < this.bounds.bottom) {
			this.extra.y += this.fullHeight
		}

		if (this.direction.y > 0 && this.mesh.position.y - this.mesh.scale.y / 2 > this.bounds.top) {
			this.extra.y -= this.fullHeight
		}
	}
}

export class Space {
	constructor({ meshes, gap = 0, viewport }) {
		Object.assign(this, { meshes, gap, viewport })

		this.itemsInColumn = 4
		this.columnCount = Math.ceil(this.meshes.length / this.itemsInColumn)

		this.translate = new Vec2(0)
		this.lastTranslate = new Vec2(0)
		this.direction = new Vec2(0)

		this._setupBounds()
		this.viewport.on('resize', this._setupBounds)

		this.items = this.meshes.map((mesh) => {
			return new SpaceItem({
				mesh,
				gap: this.gap,
				bounds: this.bounds,
				fullWidth: this._getFullWidth(),
				fullHeight: this._getFullHeight()
			})
		})
		this.place()
	}

	update() {
		this.items.forEach((item) => {
			item.update()
		})
	}

	resize() {
		this.items.forEach((item) => item.setBounds(this.bounds))
		this.place()
	}

	place() {
		this.items.forEach((item, index) => {
			const rowNumber = Math.floor(index / this.itemsInColumn)
			const columnNumber = index % this.itemsInColumn
			item.place({ x: rowNumber - 2, y: columnNumber - 1 })
			item.update()
		})
	}

	setTranslate(vec2) {
		this.lastTranslate.copy(this.translate)
		this.translate.copy(vec2)
		this.direction.sub(this.translate, this.lastTranslate).normalize()
		this.items.forEach((item) => {
			item.setTranslate(this.translate, this.direction)
		})
	}

	_setupBounds = () => {
		this.bounds = {
			top: this.viewport.height / 2,
			right: this.viewport.width / 2,
			bottom: -this.viewport.height / 2,
			left: -this.viewport.width / 2
		}

		if (this.items?.length) {
			this.items.forEach((item) => {
				item.setBounds(this.bounds)
			})
		}
	}

	_getFullWidth() {
		return this.columnCount * (this.meshes[0].scale.x + this.gap)
	}

	_getFullHeight() {
		return this.itemsInColumn * (this.meshes[0].scale.y + this.gap)
	}
}
