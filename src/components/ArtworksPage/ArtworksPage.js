import css from './ArtworksPage.module.scss'
import { useEffect, useRef } from 'react'
import { Renderer, Camera, Transform, Plane } from 'ogl'
import { Artwork } from '../../gl/Artwork.js'

const ArtworksPage = ({ images }) => {
	const ref = useRef(null)

	useEffect(() => {
		if (!window) return

		const canvas = ref.current

		const renderer = new Renderer({ canvas, antialias: true, dpr: window.devicePixelRatio })
		const gl = renderer.gl

		const camera = new Camera(gl)
		camera.position.set(0, 0, 5)
		camera.lookAt([0, 0, 0])

		const screen = { width: 0, height: 0 }
		const viewport = { width: 0, height: 0 }

		const scene = new Transform()

		const geometry = new Plane(gl, { widthSegments: 1, heightSegments: 1 })

		const artworks = images.slice(0, 1).map((image, index) => {
			return new Artwork({
				gl,
				image,
				geometry,
				scene,
				index,
				length: images.length
			})
		})
		const resizeArtworks = () => {
			artworks.forEach((artwork) => artwork.resize({ screen, viewport }))
		}

		function resize() {
			screen.width = window.innerWidth
			screen.height = window.innerHeight

			renderer.setSize(screen.width, screen.height)
			camera.perspective({
				aspect: gl.canvas.width / gl.canvas.height
			})

			const fov = camera.fov * (Math.PI / 180)
			const height = 2 * Math.tan(fov / 2) * camera.position.z
			const width = height * camera.aspect

			viewport.width = width
			viewport.height = height

			resizeArtworks()
		}

		window.addEventListener('resize', resize, false)
		resize()

		let frameId = requestAnimationFrame(update)

		function update(t) {
			frameId = requestAnimationFrame(update)
			artworks.forEach((artwork) => {
				artwork.update()
			})
			renderer.render({ scene, camera })
		}

		return () => {
			window.removeEventListener('resize', resize)
			cancelAnimationFrame(frameId)
		}
	}, [images])

	return (
		<div className={css.artworks}>
			<canvas className={css.canvas} ref={ref} />
		</div>
	)
}

export default ArtworksPage
