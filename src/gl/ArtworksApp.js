import { Renderer, Camera, Transform, Plane } from 'ogl'
import { DragControls } from './DragControls.js'
import { Loop } from './Loop.js'
import { Picture } from './Picture.js'
import { Space } from './Space.js'
import { UnitConverter } from './UnitConverter.js'

export class ArtworksApp {
	constructor({ canvas, images }) {
		Object.assign(this, { canvas, images })

		this._setupRenderer()
		this._setupCamera()
		this._setupConverter()
		this._setupScene()

		this._setupControls()

		this._resize()

		this._setupGeometry()
		this._setupPictures()
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

	_setupConverter() {
		this.converter = new UnitConverter({ camera: this.camera, width: window.innerWidth, height: window.innerHeight })
	}

	_setupScene() {
		this.scene = new Transform()
	}

	_setupControls() {
		this.controls = new DragControls({ elem: window })
	}

	_resize = () => {
		const width = window.innerWidth
		const height = window.innerHeight

		this.renderer.setSize(width, height)
		this.camera.perspective({
			aspect: this.gl.canvas.width / this.gl.canvas.height
		})
		this.converter.setScreenSize(width, height)

		if (this.pictures?.length) {
			this.pictures.forEach((picture) => picture.resize())
			this.space.resize()
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
			return new Picture({
				gl: this.gl,
				src: image.src,
				geometry: this.planeGeometry,
				width: 240,
				height: 320,
				converter: this.converter,
				scene: this.scene
			})
		})
	}

	_setupSpace() {
		this.space = new Space({ meshes: this._getMeshes(), converter: this.converter })
	}

	_getMeshes() {
		return this.pictures.map((picture) => picture.getMesh())
	}

	_setupLoop() {
		this.loop = new Loop(this._update)
	}

	_update = () => {
		this.controls.update()
		this.space.setTranslate(this.controls.currentPos)
		this.space.update()
		this.renderer.render({ scene: this.scene, camera: this.camera })
	}

	_enable() {
		this.controls.enable()
		window.addEventListener('resize', this._resize)
		this.loop.start()
	}
}
