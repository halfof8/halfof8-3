// https://discourse.threejs.org/t/roundedrectangle/28645

import { Geometry } from 'ogl'

// export function RoundedPlane(gl, w, h, r, s) {
// 	// width, height, radius corner, smoothness
//
// 	// helper const's
// 	const wi = w / 2 - r;		// inner width
// 	const hi = h / 2 - r;		// inner height
// 	const w2 = w / 2;			// half width
// 	const h2 = h / 2;			// half height
// 	const ul = r / w;			// u left
// 	const ur = ( w - r ) / w;	// u right
// 	const vl = r / h;			// v low
// 	const vh = ( h - r ) / h;	// v high
//
// 	let positions = [
//
// 		-wi, -h2, 0,  wi, -h2, 0,  wi, h2, 0,
// 		-wi, -h2, 0,  wi,  h2, 0, -wi, h2, 0,
// 		-w2, -hi, 0, -wi, -hi, 0, -wi, hi, 0,
// 		-w2, -hi, 0, -wi,  hi, 0, -w2, hi, 0,
// 		wi, -hi, 0,  w2, -hi, 0,  w2, hi, 0,
// 		wi, -hi, 0,  w2,  hi, 0,  wi, hi, 0
//
// 	];
//
// 	let uvs = [
//
// 		ul,  0, ur,  0, ur,  1,
// 		ul,  0, ur,  1, ul,  1,
// 		0, vl, ul, vl, ul, vh,
// 		0, vl, ul, vh,  0, vh,
// 		ur, vl,  1, vl,  1, vh,
// 		ur, vl,  1, vh,	ur, vh
//
// 	];
//
// 	let phia = 0;
// 	let phib, xc, yc, uc, vc, cosa, sina, cosb, sinb;
//
// 	for ( let i = 0; i < s * 4; i ++ ) {
//
// 		phib = Math.PI * 2 * ( i + 1 ) / ( 4 * s );
//
// 		cosa = Math.cos( phia );
// 		sina = Math.sin( phia );
// 		cosb = Math.cos( phib );
// 		sinb = Math.sin( phib );
//
// 		xc = i < s || i >= 3 * s ? wi : - wi;
// 		yc = i < 2 * s ? hi : -hi;
//
// 		positions.push( xc, yc, 0, xc + r * cosa, yc + r * sina, 0,  xc + r * cosb, yc + r * sinb, 0 );
//
// 		uc =  i < s || i >= 3 * s ? ur : ul;
// 		vc = i < 2 * s ? vh : vl;
//
// 		uvs.push( uc, vc, uc + ul * cosa, vc + vl * sina, uc + ul * cosb, vc + vl * sinb );
//
// 		phia = phib;
//
// 	}
//
// 	// const geometry = new THREE.BufferGeometry( );
// 	// geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ), 3 ) );
// 	// geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );
//
// 	// geometry.addAttribute('position', )
//
// 	return new Geometry(gl, {
// 		position: { size: 3, data: new Float32Array(positions) },
// 		uv: { size: 2, data: new Float32Array(uvs) }
// 	})
// }

// width, height, radiusCorner, smoothness
export function RoundedPlane(gl, w, h, r, s) {
	const pi2 = Math.PI * 2
	const n = (s + 1) * 4 // number of segments
	const indices = []
	const positions = []
	const uvs = []
	const normals = []
	let qu, sgx, sgy, x, y

	for (let j = 1; j < n + 1; j++) {
		indices.push(0, j, j + 1) // 0 is center
		normals.push(0, 0, 1)
	}
	indices.push(0, n, 1)
	positions.push(0, 0, 0) // rectangle center
	uvs.push(0.5, 0.5)
	for (let j = 0; j < n; j++) contour(j)

	const geometry = new Geometry(gl, {
		position: { size: 3, data: new Float32Array(positions) },
		uv: { size: 2, data: new Float32Array(uvs) },
		index: { size: 1, data: new Uint32Array(indices) },
		normal: { size: 3, data: normals }
	})
	// const geometry = new THREE.BufferGeometry( );
	// geometry.setIndex( new THREE.BufferAttribute( new Uint32Array( indices ), 1 ) );
	// geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ), 3 ) );
	// geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );

	return geometry

	function contour(j) {
		qu = Math.trunc((4 * j) / n) + 1 // quadrant  qu: 1..4
		sgx = qu === 1 || qu === 4 ? 1 : -1 // signum left/right
		sgy = qu < 3 ? 1 : -1 // signum  top / bottom
		x = sgx * (w / 2 - r) + r * Math.cos((pi2 * (j - qu + 1)) / (n - 4)) // corner center + circle
		y = sgy * (h / 2 - r) + r * Math.sin((pi2 * (j - qu + 1)) / (n - 4))

		positions.push(x, y, 0)
		uvs.push(0.5 + x / w, 0.5 + y / h)
	}
}
