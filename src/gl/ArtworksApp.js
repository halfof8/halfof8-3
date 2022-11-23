import { Renderer, Camera, Transform, Plane, Vec2 } from 'ogl'
import { DragControls } from './DragControls.js'
import { Loop } from './Loop.js'
import { Picture } from './Picture.js'
import { Space } from './Space.js'
import { UnitConverter } from './UnitConverter.js'
import { Screen } from './Screen.js'
import { Viewport } from './Viewport.js'

export class ArtworksApp {
	constructor({ canvas, images }) {
		Object.assign(this, { canvas, images })
		this.translate = new Vec2(0)

		this._setupRenderer()
		this._setupCamera()
		this._setupViewport()
		this._setupConverter()
		this._setupScene()

		this._setupControls()

		this._setupGeometry()
		this._setupPictures()
		this._resize()
		this._setupSpace()

		this._update()
		this._setupLoop()

		this._enable()
	}

	destroy() {
		this.controls.disable()
		this.loop.stop()
		window.removeEventListener('resize', this._resize)
	}

	_setupRenderer() {
		this.renderer = new Renderer({ canvas: this.canvas, antialias: true, dpr: window.devicePixelRatio })

		this.gl = this.renderer.gl
		// this.gl.clearColor(0, 0, 0, 1)
	}

	_setupCamera() {
		this.camera = new Camera(this.gl)
		this.camera.fov = 45
		this.camera.position.z = 5
		this.camera.lookAt([0, 0, 0])
	}

	_setupViewport() {
		this.viewport = new Viewport({ camera: this.camera })
	}

	_setupConverter() {
		this.converter = new UnitConverter({ screen: new Screen(), viewport: this.viewport })
	}

	_setupPictureSize() {
		const screenSize = this.converter.getScreenSize()
		const aspectRatio = 1333 / 1000

		const imagesCount = this.images.length
		const rowCount = 4
		const columnCount = Math.ceil(imagesCount / rowCount)
		const minHeight = screenSize.height / (rowCount - 1)
		const minWidth = screenSize.width / (columnCount - 2)

		this.pictureHeight = Math.max(minHeight, minWidth * aspectRatio)
		this.pictureWidth = this.pictureHeight / aspectRatio
	}

	_setupScene() {
		this.scene = new Transform()
	}

	_setupControls() {
		this.controls = new DragControls({ elem: window, ease: 0.05 })
	}

	_resize = () => {
		const width = window.innerWidth
		const height = window.innerHeight

		this.renderer.setSize(width, height)
		this.camera.perspective({
			aspect: this.gl.canvas.width / this.gl.canvas.height
		})

		this.viewport.resize()
		this.converter.setScreenSize(width, height)

		const { width: viewportWidth, height: viewportHeight } = this.converter.getViewportSize()
		this._setupPictureSize()
		if (this.pictures?.length) {
			this.pictures.forEach((picture) => {
				picture.setScale(this.converter.pxToUnit(this.pictureWidth), this.converter.pxToUnit(this.pictureHeight))
				picture.setViewportSize(viewportWidth, viewportHeight)
			})
			this.space?.resize()
		}
	}

	_setupGeometry() {
		this.planeGeometry = new Plane(this.gl, {
			heightSegments: 1,
			widthSegments: 1
		})
	}

	_setupPictures() {
		this.pictures = this.images.map((image) => {
			const picture = new Picture({
				gl: this.gl,
				src: image.src,
				geometry: this.planeGeometry
			})

			picture.setParent(this.scene)

			return picture
		})
	}

	_setupSpace() {
		this.space = new Space({
			meshes: this._getMeshes(),
			gap: this.converter.pxToUnit(16),
			viewport: this.viewport
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
		this.space.setTranslate(this.translate.copy(this.controls.currentPos).multiply(this.converter.pxUnitRatio * 4))
		this.space.update()
		this.renderer.render({ scene: this.scene, camera: this.camera })
	}

	_enable() {
		this.controls.enable()
		window.addEventListener('resize', this._resize)
		this.loop.start()
	}
}
