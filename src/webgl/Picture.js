import { Mesh, Program, Texture, Transform } from 'ogl'
import fragment from './shaders/image.frag'
import vertex from './shaders/image.vert'

export class Picture extends Transform {
	constructor({ renderingContext }) {
		super()
		this.renderingContext = renderingContext
		this.gl = this.renderingContext.gl
	}

	setup(src, geometry) {
		this._setupShader(src)
		this._setupMesh(geometry)

		return this
	}

	setOpacity(opacity) {
		this.program.uniforms.uAlpha.value = opacity
	}

	_setupShader(src) {
		const texture = new Texture(this.gl, {
			generateMipmaps: false
		})

		this.program = new Program(this.gl, {
			depthTest: true,
			depthWrite: true,
			fragment,
			vertex,
			uniforms: {
				tMap: { value: texture },
				uAlpha: { value: 1 },
				uFadeColor: { value: new Float32Array([0.0, 0.0, 0.0]) } // todo parameter
			},
			transparent: true
		})

		const image = new Image()

		image.crossOrigin = 'anonymous'
		image.src = src
		image.onload = () => {
			texture.image = image
		}
	}

	_setupMesh(geometry) {
		this.mesh = new Mesh(this.gl, { geometry, program: this.program })
		this.mesh.setParent(this)
	}
}
