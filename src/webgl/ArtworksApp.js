import { Camera, Renderer, Transform, Vec2 } from 'ogl'
import { DragControls } from './DragControls.js'
import { Loop } from './Loop.js'
import { Picture } from './Picture.js'
import { Screen } from './Screen.js'
import { Viewport } from './Viewport.js'
import { RoundedPlane } from './geometry/RoundedPlane.js'
import { Grid } from './Grid.js'
import { Square } from './scene/Square.js'

export class ArtworksApp {
	constructor({ canvas, images }) {
		Object.assign(this, { canvas, images })

		this.gap = 16
		this.pointerSpeed = 4
		this.pointerEase = 0.05
		this.pictureAspectRatio = 1.3333
		this.rowCount = 4
		this.columnCount = Math.ceil(this.images.length / this.rowCount)

		this.translate = new Vec2(0)

		this._setupScreen()

		this._setupRenderer()
		this._setupCamera()

		this._setupViewport()
		this._setupUnitRatio()

		this._setupScene()
		this._setupGeometry()

		this._setupPictureSize()
		this._setupPictures()

		this._setupBounds()
		this._setupSpace()
		this._setupControls()

		this._update()
		this._setupLoop()

		this._enable()
	}

	destroy() {
		this.controls.disable()
		this.loop.stop()
		window.removeEventListener('resize', this._resize)
	}

	_setupScreen() {
		this.screen = new Screen()
	}

	_setupRenderer() {
		this.renderer = new Renderer({ canvas: this.canvas, antialias: true, dpr: window.devicePixelRatio })
		this.renderer.setSize(this.screen.width, this.screen.height)

		this.gl = this.renderer.gl
	}

	_setupCamera() {
		this.camera = new Camera(this.gl)
		this.camera.perspective({
			fov: 45,
			aspect: this.gl.canvas.width / this.gl.canvas.height
		})
		this.camera.position.set(0, 0, 5)
		this.camera.lookAt([0, 0, 0])
	}

	_setupViewport() {
		this.viewport = new Viewport({ camera: this.camera })
	}

	_setupUnitRatio() {
		this.unitRatio = this.viewport.height / this.screen.height
		this.pxToUnit = (value) => value * this.unitRatio
	}

	_setupPictureSize() {
		const imagesCount = this.images.length
		const columnCount = Math.ceil(imagesCount / this.rowCount)

		const minHeight = this.screen.height / (this.rowCount - 1)
		const minWidth = this.screen.width / (columnCount - 1)

		this.pictureHeight = this.pxToUnit(Math.max(minHeight, minWidth * this.pictureAspectRatio))
		this.pictureWidth = this.pictureHeight / this.pictureAspectRatio
	}

	_setupScene() {
		this.scene = new Transform()
	}

	_setupControls() {
		this.controls = new DragControls({ elem: this.canvas, ease: this.pointerEase })
	}

	_resize = () => {
		this.screen.resize()
		const { width, height } = this.screen

		this.renderer.setSize(width, height)
		this.camera.perspective({
			aspect: this.gl.canvas.width / this.gl.canvas.height
		})

		this.viewport.resize()
		this._setupUnitRatio()

		this._setupPictureSize()

		this.pictures.forEach((picture) => {
			picture.setScale(this.pictureWidth, this.pictureHeight)
		})
	}

	_setupGeometry() {
		this.geometry = RoundedPlane(this.gl, 1, 1.333, 0.05, 16)
	}

	_setupPictures() {
		this.pictures = []
		for (let i = 0; i < this.rowCount * this.columnCount; i += 1) {
			const imageIndex = i % this.images.length
			const image = this.images[imageIndex]

			const picture = new Picture({ gl: this.gl })
			picture.setup(image.src, this.geometry)
			picture.scale.set(this.pictureWidth)

			this.pictures.push(picture)
		}
	}

	_setupSpace() {
		this.space = new Grid({
			gl: this.gl,
			gap: this.pxToUnit(this.gap),
			translate: this.translate,
			scene: this.scene,
			bounds: this.bounds,
			size: new Vec2(this.columnCount, this.rowCount),
			cellSize: new Vec2(this.pictureWidth, this.pictureHeight)
		})

		this.space.traverse((cell, index) => {
			const helper = new Square(this.gl)
			helper.setScale(this.pictureWidth, this.pictureHeight)
			helper.setParent(cell)
			this.pictures[index].setParent(cell)
		})
	}

	_setupBounds = () => {
		this.bounds = {
			top: this.viewport.height / 2,
			right: this.viewport.width / 2,
			bottom: -this.viewport.height / 2,
			left: -this.viewport.width / 2
		}
	}

	_setupLoop() {
		this.loop = new Loop(this._update)
	}

	_update = () => {
		this.controls.update()
		this.translate.copy(this.controls.currentPos).multiply(this.unitRatio * this.pointerSpeed)
		this.space.update()
		this.renderer.render({ scene: this.scene, camera: this.camera })
	}

	_enable() {
		this.controls.enable()
		window.addEventListener('resize', this._resize)
		this.loop.start()
	}
}
