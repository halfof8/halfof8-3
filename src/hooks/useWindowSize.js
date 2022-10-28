import { useEffect, useState } from 'react'

export const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState({
		width: undefined,
		height: undefined
	})

	useEffect(() => {
		if (!window) return

		const resizeHandler = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight
			})
		}

		window.addEventListener('resize', resizeHandler)

		resizeHandler()
		return () => window.removeEventListener('resize', resizeHandler)
	}, [])

	return windowSize
}
