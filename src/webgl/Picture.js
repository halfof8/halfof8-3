import { Mesh, Program, Texture, Transform } from 'ogl'
import fragment from './shaders/image.frag'
import vertex from './shaders/image.vert'

export class Picture extends Transform {
	constructor({ gl }) {
		super()
		this.gl = gl
	}

	setup(src, geometry) {
		this._setupShader(src)
		this._setupMesh(geometry)

		return this
	}

	_setupShader(src) {
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
		image.src = src
		image.onload = () => {
			texture.image = image
			// this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight]
		}
	}

	_setupMesh(geometry) {
		this.mesh = new Mesh(this.gl, { geometry, program: this.program })
		this.mesh.setParent(this)
	}
}
