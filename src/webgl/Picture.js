import { Mesh, Program, Texture, Transform } from 'ogl'
import fragment from './shaders/image.frag'
import vertex from './shaders/image.vert'
import { Square } from './scene/Square.js'

export class Picture extends Transform {
	constructor({ gl }) {
		super()
		this.gl = gl
	}

	setup(src, geometry) {
		this._setupShader(src)
		this._setupMesh(geometry)

		// this.helper = new Square(this.gl)
		// this.helper.setParent(this)

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

// export class Picture {
// 	constructor({ gl, src, geometry }) {
// 		Object.assign(this, { gl, src, geometry })
//
// 		this.group = new Transform()
// 		this.square = new Square(this.gl)
// 		this.square.setParent(this.group)
//
// 		this._setupShader()
// 		this._setupMesh()
// 	}
//
// 	setParent(parent) {
// 		this.group.setParent(parent)
// 	}
//
// 	setViewportSize(width, height) {
// 		// this.program.uniforms.uViewportSizes.value = [width, height]
// 	}
//
// 	setScale(x, y) {
// 		this.mesh.scale.x = x
// 		this.mesh.scale.y = y
// 		// this.mesh.program.uniforms.uPlaneSizes.value = [x, y]
// 	}
//
// 	_setupShader() {
// 		const texture = new Texture(this.gl, {
// 			generateMipmaps: false
// 		})
//
// 		this.program = new Program(this.gl, {
// 			depthTest: false,
// 			depthWrite: false,
// 			fragment,
// 			vertex,
// 			uniforms: {
// 				tMap: { value: texture },
// 				uPlaneSizes: { value: [0, 0] },
// 				uImageSizes: { value: [0, 0] },
// 				uViewportSizes: { value: [1, 1] }
// 			},
// 			transparent: true
// 		})
//
// 		const image = new Image()
//
// 		image.crossOrigin = 'anonymous'
// 		image.src = this.src
// 		image.onload = () => {
// 			texture.image = image
// 			// this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight]
// 		}
// 	}
//
// 	_setupMesh() {
// 		this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program })
// 		this.mesh.scale.set(1.33, 1.33)
// 		this.mesh.setParent(this.group)
// 	}
// }
