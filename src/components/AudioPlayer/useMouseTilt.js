import { useMotionMouse } from '../../hooks/useMotionMouse.js'
import { useWindowSize } from '../../hooks/useWindowSize.js'
import { useTransform } from 'framer-motion'

export const useMouseTilt = (spring = {}) => {
	const { x, y } = useMotionMouse(spring)
	const { width, height } = useWindowSize()

	const rotateX = useTransform(y, [0, height], [15, -15])
	const rotateY = useTransform(x, [0, width], [-15, 15])

	return { style: { rotateX, rotateY } }
}
