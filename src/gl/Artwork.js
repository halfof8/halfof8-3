import { Mesh, Program, Texture } from 'ogl'
import fragment from './shaders/image.frag'
import vertex from './shaders/image.vert'

export class Artwork {
	constructor({ gl, image, geometry, scene, index, length }) {
		this.gl = gl
		this.image = image
		this.geometry = geometry
		this.scene = scene
		this.index = index
		this.length = length

		this.setupShader()
		this.setupMesh()
		this.setPosition()
	}

	setupShader() {
		const texture = new Texture(this.gl, {
			generateMipmaps: false
		})

		const program = new Program(this.gl, {
			depthTest: false,
			depthWrite: false,
			fragment,
			vertex,
			uniforms: {
				tMap: { value: texture }
				// uPlaneSizes: { value: [0, 0] },
				// uImageSizes: { value: [0, 0] },
				// uViewportSizes: { value: [window.innerWidth, window.innerHeight] },
				// uSpeed: { value: 0 },
				// uTime: { value: 100 * Math.random() }
			},
			transparent: true
		})

		const image = new Image()

		image.crossOrigin = 'anonymous'
		image.src = this.image.src
		image.onload = () => {
			texture.image = image

			// program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight]
		}

		this.program = program
	}

	setupMesh() {
		this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program })
		this.plane.setParent(this.scene)
	}

	setPosition() {
		// this.plane.position.set(0, 0, 0)
		// const x0 = 0
		// const y0 = 0
		// const gap = .1
		// const offset = this.index % 2 === 0 ? .3 : -.3
		//
		// this.plane.position.x = x0 + gap * this.index + this.index % 6
		// this.plane.position.y = y0 + gap + offset - Math.floor((this.index + 1) / 6)
	}

	update() {
		// this.program.uniforms.uTime.value += .04
	}

	resize({ screen, viewport }) {
		if (screen) this.screen = screen
		if (viewport) this.viewport = viewport

		this.scale = 4

		this.plane.scale.y = (this.viewport.height * (100 * this.scale)) / this.screen.height
		this.plane.scale.x = (this.viewport.width * (75 * this.scale)) / this.screen.width
	}
}
