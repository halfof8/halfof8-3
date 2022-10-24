/**
 * @typedef {Object} LoopController
 * @property {Function} start
 * @property {Function} stop
 */

/**
 * @param callback {function:void}
 * @return {LoopController}
 */
export const makeLoop = (callback) => {
	let frameId = null

	const loop = () => {
		frameId = requestAnimationFrame(loop)
		callback()
	}

	const start = () => {
		if (frameId !== null) return
		frameId = requestAnimationFrame(loop)
	}

	const stop = () => {
		cancelAnimationFrame(frameId)
		frameId = null
	}

	return { start, stop }
}

/**
 * @param fps {number} - frames per second
 * @param callback {function:void}
 * @return {LoopController}
 */
export const makeLoopWithFpsLimit = (fps, callback) => {
	const frameTime = 1000 / fps
	let frameId = null
	let lastTime

	const loop = () => {
		frameId = requestAnimationFrame(loop)

		const currentTime = Date.now()
		const elapsed = currentTime - lastTime

		if (elapsed > frameTime) {
			callback()
			lastTime = currentTime
		}
	}

	const start = () => {
		if (frameId !== null) return
		lastTime = Date.now()
		frameId = requestAnimationFrame(loop)
	}

	const stop = () => {
		cancelAnimationFrame(frameId)
		frameId = null
	}

	return { start, stop }
}
