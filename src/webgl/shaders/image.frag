precision highp float;

uniform sampler2D tMap;
uniform float uAlpha;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
	vec3 tex = texture2D(tMap, vUv).rgb;

	gl_FragColor.rgb = tex;
	gl_FragColor.a = uAlpha;
}
