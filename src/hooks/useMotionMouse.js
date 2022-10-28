import { useEffect } from 'react'
import { useSpring } from 'framer-motion'

export const useMotionMouse = (spring = {}) => {
	const x = useSpring(0, spring)
	const y = useSpring(0, spring)

	useEffect(() => {
		if (!window) return

		const mousemoveHandler = ({ clientX, clientY }) => {
			x.set(clientX)
			y.set(clientY)
		}

		window.addEventListener('mousemove', mousemoveHandler)

		return () => {
			window.removeEventListener('mousemove', mousemoveHandler)
		}
	}, [x, y])

	return { x, y }
}
