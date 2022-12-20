import { Loop } from '../Loop.js'
import { RoundedPlane } from '../geometry/RoundedPlane.js'
import { RenderingContext } from './RenderingContext.js'
import { initGrid } from './initGrid.js'
import { initSlider } from './initSlider.js'

export class Artworks {
	constructor({ canvas, images }) {
		Object.assign(this, { canvas, images })

		this.renderingContext = this._setupRenderingContext()
		this.geometry = this._setupGeometry()
		this.grid = this._setupGrid()
		this.slider = this._setupSlider()
		this.loop = new Loop(this._update)

		this._enable()
		console.log(this)
	}

	destroy() {
		this.grid.disable()
		this.slider.disable()
		this.loop.stop()
	}

	_setupRenderingContext() {
		return new RenderingContext(this.canvas)
	}

	_setupSlider() {
		return initSlider({
			renderingContext: this.renderingContext,
			images: this.images,
			geometry: this.geometry
		})
	}

	_setupGeometry() {
		return new RoundedPlane(this.renderingContext.renderer.gl, {
			width: 1,
			height: 1.3333,
			radius: 0.015,
			smoothness: 8
		})
	}

	_setupGrid() {
		return initGrid({
			renderingContext: this.renderingContext,
			images: this.images,
			geometry: this.geometry
		})
	}

	_update = () => {
		this.grid.update()
		this.slider.update()

		this.renderingContext.renderer.render({
			scene: this.renderingContext.scene,
			camera: this.renderingContext.camera
		})
	}

	_enable() {
		this.grid.enable()
		this.slider.enable()
		this.loop.start()
	}
}
