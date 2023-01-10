import css from './ArtworksPage.module.scss'
import { useEffect, useRef } from 'react'
import { Artworks } from '../../webgl/Artworks'

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

		const canvas = ref.current
		const app = new Artworks({ canvas, images })
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
