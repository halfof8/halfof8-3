import { Geometry } from 'ogl'

export class RoundedPlane extends Geometry {
	constructor(gl, { width = 1, height = 1, radius = 0.1, smoothness = 8, attributes = {} }) {
		const position = []
		const normal = []
		const uv = []
		const index = []

		RoundedPlane.build(position, normal, uv, index, width, height, radius, smoothness)

		Object.assign(attributes, {
			position: { size: 3, data: new Float32Array(position) },
			normal: { size: 3, data: new Float32Array(normal) },
			uv: { size: 2, data: new Float32Array(uv) },
			index: { data: new Uint32Array(index) }
		})

		super(gl, attributes)
	}

	// https://discourse.threejs.org/t/roundedrectangle/28645
	static build(position, normal, uv, index, w, h, r, s) {
		const pi2 = Math.PI * 2
		const n = (s + 1) * 4 // number of segments
		let qu, sgx, sgy, x, y

		for (let j = 1; j < n + 1; j++) {
			index.push(0, j, j + 1) // 0 is center
		}
		index.push(0, n, 1)
		position.push(0, 0, 0) // rectangle center
		uv.push(0.5, 0.5)

		for (let j = 0; j < n + 1; j++) {
			contour(j)
		}

		position.forEach(() => {
			normal.push(0, 0, 1)
		})

		function contour(j) {
			qu = Math.trunc((4 * j) / n) + 1 // quadrant  qu: 1..4
			sgx = qu === 1 || qu === 4 ? 1 : -1 // signum left/right
			sgy = qu < 3 ? 1 : -1 // signum  top / bottom
			x = sgx * (w / 2 - r) + r * Math.cos((pi2 * (j - qu + 1)) / (n - 4)) // corner center + circle
			y = sgy * (h / 2 - r) + r * Math.sin((pi2 * (j - qu + 1)) / (n - 4))

			position.push(x, y, 0)
			uv.push(0.5 + x / w, 0.5 + y / h)
		}
	}
}
