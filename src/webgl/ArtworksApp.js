import { Camera, Plane, Renderer, Transform, Vec2 } from 'ogl'
import { DragControls } from './DragControls.js'
import { Loop } from './Loop.js'
import { Picture } from './Picture.js'
import { Space } from './Space.js'
import { Screen } from './Screen.js'
import { Viewport } from './Viewport.js'

export class ArtworksApp {
	constructor({ canvas, images }) {
		Object.assign(this, { canvas, images })

		this.gap = 16
		this.pointerSpeed = 4
		this.pointerEase = 0.05
		this.pictureAspectRatio = 1.333
		this.itemsInColumn = 4 // mb row count?
		this.itemsInRow = Math.ceil(this.images.length / this.itemsInColumn) // mb column count?

		this.translate = new Vec2(0)

		this._setupScreen()

		this._setupRenderer()
		this._setupCamera()

		this._setupViewport()
		this._setupUnitRatio()

		this._setupScene()
		this._setupGeometry()
		this._setupPictures()

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
		const columnCount = Math.ceil(imagesCount / this.itemsInColumn)

		const minHeight = this.screen.height / (this.itemsInColumn - 1)
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
			picture.setViewportSize(this.viewport.width, this.viewport.height)
		})

		this.space
			.setParams({
				gap: this.pxToUnit(this.gap),
				itemWidth: this.pictureWidth,
				itemHeight: this.pictureHeight
			})
			.resize()
	}

	_setupGeometry() {
		this.planeGeometry = new Plane(this.gl, {
			heightSegments: 1,
			widthSegments: 1
		})
	}

	_setupPictures() {
		this._setupPictureSize()

		this.pictures = []
		for (let i = 0; i < this.itemsInColumn * this.itemsInRow; i += 1) {
			const imageIndex = i % this.images.length
			const image = this.images[imageIndex]

			const picture = new Picture({
				gl: this.gl,
				src: image.src,
				geometry: this.planeGeometry
			})

			picture.setScale(this.pictureWidth, this.pictureHeight)
			picture.setViewportSize(this.viewport.width, this.viewport.height)
			picture.setParent(this.scene)

			this.pictures.push(picture)
		}
	}

	_setupSpace() {
		this.space = new Space({
			meshes: this._getMeshes(),
			gap: this.pxToUnit(this.gap),
			viewport: this.viewport,
			itemsInColumn: this.itemsInColumn,
			itemWidth: this.pictureWidth,
			itemHeight: this.pictureHeight
		})
	}

	_getMeshes() {
		return this.pictures.map((picture) => picture.mesh)
	}

	_setupLoop() {
		this.loop = new Loop(this._update)
	}

	_update = () => {
		this.controls.update()
		this.space.setTranslate(
			this.translate.copy(this.controls.currentPos).multiply(this.unitRatio * this.pointerSpeed)
		)
		this.space.update()
		this.renderer.render({ scene: this.scene, camera: this.camera })
	}

	_enable() {
		this.controls.enable()
		window.addEventListener('resize', this._resize)
		this.loop.start()
	}
}
