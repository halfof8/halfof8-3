import { Mesh, Program, Texture } from 'ogl'
import fragment from './shaders/picture.frag'
import vertex from './shaders/picture.vert'

export class Picture {
	constructor({ gl, src, geometry }) {
		Object.assign(this, { gl, src, geometry })

		this._setupShader()
		this._setupMesh()
	}

	setParent(parent) {
		this.mesh.setParent(parent)
	}

	setViewportSize(width, height) {
		this.program.uniforms.uViewportSizes.value = [width, height]
	}

	setScale(x, y) {
		this.mesh.scale.x = x
		this.mesh.scale.y = y
		this.mesh.program.uniforms.uPlaneSizes.value = [x, y]
	}

	_setupShader() {
		const texture = new Texture(this.gl, {
			generateMipmaps: false
		})

		this.program = new Program(this.gl, {
			depthTest: false,
			depthWrite: false,
			fragment,
			vertex,
			uniforms: {
				tMap: { value: texture },
				uPlaneSizes: { value: [0, 0] },
				uImageSizes: { value: [0, 0] },
				uViewportSizes: { value: [1, 1] }
			},
			transparent: true
		})

		const image = new Image()

		image.crossOrigin = 'anonymous'
		image.src = this.src
		image.onload = () => {
			texture.image = image
			this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight]
		}
	}

	_setupMesh() {
		this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program })
	}
}
