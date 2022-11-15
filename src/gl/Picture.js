import { Mesh, Program, Texture } from 'ogl'
import fragment from './shaders/picture.frag'
import vertex from './shaders/picture.vert'

export class Picture {
	constructor({ gl, src, geometry, width, height, converter, scene }) {
		Object.assign(this, { gl, src, geometry, width, height, converter, scene })

		this._setupShader()
		this._setupMesh()
		this.resize()
	}

	getMesh() {
		return this.mesh
	}

	resize() {
		const { width, height } = this.converter.getViewportSize()

		this.program.uniforms.uViewportSizes.value = [width, height]
		this.mesh.scale.x = this.converter.pxToUnit(this.width)
		this.mesh.scale.y = this.converter.pxToUnit(this.height)
		this.mesh.program.uniforms.uPlaneSizes.value = [this.mesh.scale.x, this.mesh.scale.y]
	}

	_setupShader() {
		const { width, height } = this.converter.getViewportSize()

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
				uViewportSizes: { value: [width, height] }
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
		this.position = this.mesh.position
		this.mesh.setParent(this.scene)
	}
}
