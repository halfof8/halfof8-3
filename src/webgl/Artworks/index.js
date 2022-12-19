import { DragControls } from '../DragControls.js'
import { Loop } from '../Loop.js'
import { RoundedPlane } from '../geometry/RoundedPlane.js'
import { WheelControls } from '../WheelControls.js'
import { ControlsComposer } from '../ControlsComposer.js'
import { ArrowControls } from '../ArrowControls.js'
import { RenderingContext } from './RenderingContext.js'
import { initGrid } from './initGrid.js'

export class Artworks {
	constructor({ canvas, images }) {
		Object.assign(this, { canvas, images })

		this.controlsMultiplier = 4
		this.pointerEase = 0.05

		this.renderingContext = this._setupRenderingContext()

		this.geometry = this._setupGeometry()

		this.grid = this._setupGrid()
		this.controls = this._setupControls()

		this.loop = new Loop(this._update)

		this._enable()
	}

	destroy() {
		this.controls.disable()
		this.loop.stop()
	}

	_setupRenderingContext() {
		return new RenderingContext(this.canvas)
	}

	_setupControls() {
		const options = { elem: this.canvas, ease: this.pointerEase }
		const amount = { x: 50, y: 50 }

		return new ControlsComposer([
			new DragControls(options),
			new WheelControls({ ...options, multiplier: 4 }),
			new ArrowControls({ ...options, amount, elem: window })
		])
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
		this.controls.update()

		this.grid.translate
			.copy(this.controls.currentPos)
			.multiply(this.renderingContext.pxRatio * this.controlsMultiplier)
		this.grid.update()

		this.renderingContext.renderer.render({
			scene: this.renderingContext.scene,
			camera: this.renderingContext.camera
		})
	}

	_enable() {
		this.controls.enable()
		this.loop.start()
	}
}
