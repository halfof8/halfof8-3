import css from './AudioPlayer.module.scss'
import { useEffect, useRef } from 'react'

const STROKE_WIDTH = 1.4
const STROKE_COLOR = '#FAFF00'
const FFT_SIZE = 256 // affects visualisation points count. must be equals to power of 2 and not less than 32
const PHASE_SHIFT_FACTOR = 40 // affects "sin movement speed"
const SIN_PERIODS_COUNT = 6
const FREQUENCY_CUTOFF = 0.4 // cut the upper frequencies
const INTERPOLATE_FRAME = 1
const GAIN_FACTOR = 20

function lerp(start, end, t) {
	return start * (1 - t) + end * t
}

const AudioPlayer = ({ audioFile }) => {
	const canvasRef = useRef()
	const audioRef = useRef(null)

	const play = () => audioRef.current.play()
	const pause = () => audioRef.current.pause()

	useEffect(() => {
		if (!window?.AudioContext) return

		const audio = new Audio(audioFile)
		audio.crossOrigin = 'anonymous'
		audio.load()

		audioRef.current = audio

		const ac = new AudioContext()
		const analyser = ac.createAnalyser()
		const sourceNode = ac.createMediaElementSource(audio)

		analyser.fftSize = FFT_SIZE
		sourceNode.connect(analyser)
		analyser.connect(ac.destination)

		const bufferLength = analyser.frequencyBinCount
		const timeDataArray = new Uint8Array(bufferLength)
		const frequencyDataArray = new Uint8Array(bufferLength)
		const pointsCount = Math.round(FREQUENCY_CUTOFF * bufferLength)

		const staticNoise = Array.from({ length: pointsCount }, () => Math.random())

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

		const segmentWidth = width / (pointsCount - 1)
		let x = 0
		let y = height / 2
		let phase = 0
		let frameCount = 0
		let lastFrame = []
		let nextFrame = []

		const computeFrame = () => {
			const frame = []

			for (let i = 0; i < pointsCount; i++) {
				const signalValueInTimeDomain = (128 - timeDataArray[i]) / 128
				const signalValueInFrequencyDomain = frequencyDataArray[i] / 255

				phase += Math.PI / PHASE_SHIFT_FACTOR / (pointsCount - 1)
				const sinArg = (i / (pointsCount - 1)) * Math.PI * 2 * SIN_PERIODS_COUNT + phase
				const sinArg2 = 1.27 * (i / (pointsCount - 1)) * Math.PI * 2 * SIN_PERIODS_COUNT - phase
				const sinArg3 = 1.77 * (i / (pointsCount - 1)) * Math.PI * 2 * SIN_PERIODS_COUNT + phase

				const sin = Math.sin(sinArg)
				const sin2 = Math.sin(sinArg2 * 1.37)
				const cos = Math.cos(sinArg3 * 1.77)

				const noise = sin * sin2 * cos

				let normalizedY = signalValueInFrequencyDomain * 1.3
				normalizedY += signalValueInFrequencyDomain ** 0.9 * noise

				if (normalizedY > 1) normalizedY = 1
				y = (height - normalizedY * height) / 2

				frame[i] = { x, y }

				x += segmentWidth
			}

			return frame
		}

		const drawFrame = (arr) => {
			for (let i = 0; i < arr.length; i++) {
				const { x, y } = arr[i]

				if (i === 0) {
					ctx.moveTo(x, y)
				} else {
					ctx.lineTo(x, y)
				}
				ctx.stroke()
			}
		}

		let frameId
		const render = () => {
			frameId = requestAnimationFrame(render)

			x = 0

			analyser.getByteTimeDomainData(timeDataArray)
			analyser.getByteFrequencyData(frequencyDataArray)

			ctx.clearRect(0, 0, width, height)

			ctx.lineWidth = STROKE_WIDTH
			ctx.strokeStyle = STROKE_COLOR
			ctx.beginPath()

			if (frameCount === 0) {
				lastFrame = computeFrame()
				nextFrame = lastFrame
			} else if (frameCount % INTERPOLATE_FRAME === 0) {
				nextFrame = computeFrame()
			}

			const frame = lastFrame.map(({ x, y: y0 }, i) => {
				const { y: y1 } = nextFrame[i]
				const y = lerp(y0, y1, 0.1)
				return { x, y }
			})
			drawFrame(frame)

			lastFrame = frame

			frameCount++
		}

		frameId = requestAnimationFrame(render)

		return () => {
			cancelAnimationFrame(frameId)
			analyser.disconnect(ac.destination)
			sourceNode.disconnect(analyser)
			ac.close()
		}
	}, [audioFile])

	return (
		<div className={css.player}>
			<div className={css.viewport}>
				<div className={css.audio}>
					<button onClick={play}>Play</button>
					<button onClick={pause}>Pause</button>
				</div>
				<canvas className={css.canvas} height="100" width="500" ref={canvasRef} />
			</div>
		</div>
	)
}

export default AudioPlayer
