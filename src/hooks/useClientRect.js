import { useCallback, useState } from 'react'

export const useClientRect = (deps) => {
	const [rect, setRect] = useState(null)
	const ref = useCallback((node) => {
		if (node !== null) {
			setRect(node.getBoundingClientRect())
		}
	}, deps)

	return [rect, ref]
}
