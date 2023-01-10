import { Camera, Renderer, Transform } from 'ogl'
import EventEmitter from '../EventEmitter.js'

export class RenderingContext extends EventEmitter {
	constructor(canvas) {
		super()
		this.renderer = this.createRenderer(canvas)
		this.camera = this.createCamera()
		this.scene = this.createScene()
		this.pxRatio = this.computePxRatio()

		// aliases
		this.gl = this.renderer.gl
		this.canvas = this.gl.canvas

		window.addEventListener('resize', this.resize)
	}

	createRenderer(canvas) {
		const renderer = new Renderer({
			canvas,
			dpr: window.devicePixelRatio,
			antialias: true,
			alpha: true
		})
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.gl.clearColor(0, 0, 0, 0)

		return renderer
	}

	createCamera() {
		const gl = this.renderer.gl
		const camera = new Camera(gl, {
			fov: 45,
			aspect: gl.canvas.width / gl.canvas.height
		})
		camera.position.z = 20
		camera.lookAt([0, 0, 0])

		return camera
	}

	createScene() {
		return new Transform()
	}

	computePxRatio() {
		const fov = this.camera.fov * (Math.PI / 180)
		const height = 2 * Math.tan(fov / 2) * this.camera.position.z
		// const width = height * this.camera.aspect

		return height / window.innerHeight
	}

	resize = () => {
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.camera.perspective({
			aspect: this.renderer.gl.canvas.width / this.renderer.gl.canvas.height
		})
		this.pxRatio = this.computePxRatio()
		this.emit('resize')
	}
}
