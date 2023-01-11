import css from './ArtworksPage.module.scss'
import { useEffect, useRef } from 'react'
import { Artworks } from '../../webgl/Artworks'
import { Pane } from 'tweakpane'

// todo memoize gl app
// const memoizedApp = ({ canvas }) => {
// 	if (this.app) {
// 		this.app.setCanvas(canvas)
// 		return this.app
// 	}
// 	this.app = new App({ canvas })
// 	return this.app
// }

const ArtworksPage = ({ images }) => {
	const ref = useRef(null)

	useEffect(() => {
		if (!window) return

		const PARAMS = {
			snapping: true,
			minOpacity: 0.2
		}

		const pane = new Pane()
		console.log(pane)

		pane.addInput(PARAMS, 'snapping')
		pane.addInput(PARAMS, 'minOpacity', {
			min: 0,
			max: 1
		})

		const canvas = ref.current
		const app = new Artworks({ canvas, images, PARAMS })
		window.app = app

		return () => {
			app.destroy()
		}
	}, [images])

	return (
		<div className={css.artworks}>
			<canvas className={css.canvas} ref={ref} />
		</div>
	)
}

export default ArtworksPage
