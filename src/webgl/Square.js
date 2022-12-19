import { Mesh, Plane, Program } from 'ogl'

let geometry
const getGeometry = (gl) => {
	if (geometry) return geometry
	geometry = new Plane(gl)
	return geometry
}

let program
const getProgram = (gl) => {
	if (program) return program
	program = new Program(gl, {
		vertex: `
				attribute vec3 position;

				uniform mat4 modelViewMatrix;
				uniform mat4 projectionMatrix;

				void main() {
					 gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
		fragment: `
				void main() {
					 gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);
				}
			`
	})
	return program
}

export class Square {
	constructor(gl) {
		this.gl = gl

		this.geometry = getGeometry(this.gl)
		this.program = getProgram(this.gl)

		this.mesh = new Mesh(this.gl, {
			geometry: this.geometry,
			program: this.program,
			mode: this.gl.LINE_LOOP
		})

		this.position = this.mesh.position
	}

	setParent(parent) {
		this.mesh.setParent(parent)
	}

	setScale(x, y) {
		this.mesh.scale.x = x
		this.mesh.scale.y = y
	}
}
