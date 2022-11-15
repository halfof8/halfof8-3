import { Vec2 } from 'ogl'

class SpaceItem {
	constructor({ mesh, gap, converter }) {
		Object.assign(this, { mesh, gap, converter })

		this.translate = new Vec2(0)
		this.offset = new Vec2(0)
	}

	place({ x, y }) {
		const scale = this.mesh.scale
		this.gapInUnit = this.converter.pxToUnit(this.gap)

		this.offset.x = x * (scale.x + this.gapInUnit)
		this.offset.y = -y * (scale.y + this.gapInUnit)

		this.update()
	}

	setTranslate(vec2) {
		this.translate.copy(vec2)
	}

	update() {
		this.mesh.position.x = this.offset.x + this.translate.x
		this.mesh.position.y = this.offset.y + this.translate.y
	}
}

export class Space {
	constructor({ meshes, converter }) {
		Object.assign(this, { meshes, converter })

		this.gap = 16
		this.translate = new Vec2(0)
		this.items = this.meshes.map((mesh) => {
			return new SpaceItem({ mesh, converter: this.converter, gap: this.gap })
		})
		this.place()
	}

	place() {
		this.items.forEach((item, index) => {
			const rowNumber = Math.floor(index / 3)
			const columnNumber = index % 3
			item.place({ x: rowNumber - 2, y: columnNumber - 1 })
		})
	}

	resize() {
		this.place()
	}

	setTranslate(vec2) {
		this.translate.copy(vec2).multiply(this.converter.pxUnitRatio)
		this.items.forEach((item) => item.setTranslate(this.translate))
	}

	update() {
		this.items.forEach((item) => {
			item.update()
		})
	}
}
