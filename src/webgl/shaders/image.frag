precision highp float;

uniform sampler2D tMap;
uniform float uAlpha;
uniform vec3 uFadeColor;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
	vec3 tex = texture2D(tMap, vUv).rgb;

	gl_FragColor.rgb = mix(uFadeColor, tex, uAlpha);
	gl_FragColor.a = 1.0;
}
