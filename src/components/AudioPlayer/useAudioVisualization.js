import { useEffect, useRef } from 'react'
import { makeLoop, makeLoopWithFpsLimit } from '../../utils/makeLoop.js'

const FPS = 12
const STROKE_WIDTH = 1.4
const STROKE_COLOR = '#FAFF00'
const FFT_SIZE = 128
const PHASE_SHIFT_FACTOR = 20
const SIN_PERIODS_COUNT = 4
const FREQUENCY_CUTOFF = 0.5

export const useAudioVisualization = (analyser) => {
	const canvasRef = useRef(null)

	useEffect(() => {
		if (!(window && analyser)) return

		analyser.fftSize = FFT_SIZE

		const bufferLength = analyser.frequencyBinCount
		const dataArray = new Uint8Array(bufferLength)
		const pointsCount = Math.round(FREQUENCY_CUTOFF * bufferLength)

		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		const { width, height } = canvas.getBoundingClientRect()

		if (window.devicePixelRatio > 1) {
			canvas.width = width * window.devicePixelRatio
			canvas.height = height * window.devicePixelRatio
			ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

			canvas.style.width = width + 'px'
			canvas.style.height = height + 'px'
		}

		const yCoordinates = []

		ctx.lineWidth = STROKE_WIDTH
		ctx.strokeStyle = STROKE_COLOR

		const segmentWidth = width / (pointsCount - 1)
		let x = 0
		const draw = () => {
			ctx.clearRect(0, 0, width, height)
			ctx.beginPath()

			x = 0
			for (let i = 0; i < pointsCount; i++) {
				const y = yCoordinates[i]

				if (i === 0) {
					ctx.moveTo(x, y)
				} else {
					ctx.lineTo(x, y)
				}

				x += segmentWidth
			}
			ctx.stroke()
		}

		let y = height / 2
		let phase = 0
		const calculate = () => {
			analyser.getByteFrequencyData(dataArray)

			for (let i = 0; i < pointsCount; i++) {
				const signalValue = dataArray[i] / 255

				phase += Math.PI / PHASE_SHIFT_FACTOR / (pointsCount - 1)
				const fullPhase = (i / (pointsCount - 1)) * Math.PI * 2 * SIN_PERIODS_COUNT + phase

				const noise = Math.sin(fullPhase) * Math.cos(fullPhase * 1.17) * Math.sin(fullPhase * 1.37)

				const normalizedY = noise * 0.3 * signalValue + signalValue * 0.7

				y = (height - normalizedY * height) / 2
				yCoordinates[i] = y
			}
		}

		const calculateLoop = makeLoop(calculate) // for some (unknown) reasons we need to do calculation on each frame
		const drawLoop = makeLoopWithFpsLimit(FPS, draw)
		calculateLoop.start()
		drawLoop.start()

		return () => {
			calculateLoop.stop()
			drawLoop.stop()
		}
	}, [analyser])

	return { canvasRef }
}
