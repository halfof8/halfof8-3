import css from './AudioPlayer.module.scss'
import { useEffect, useRef } from 'react'

const STROKE_WIDTH = 2
const STROKE_COLOR = '#FAFF00'
const FFT_SIZE = 128
const PHASE_SHIFT_FACTOR = 20
const SIN_PERIODS_COUNT = 4
const FREQUENCY_CUTOFF = 0.5

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
		const dataArray = new Uint8Array(bufferLength)
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

		let frameId
		const render = () => {
			frameId = requestAnimationFrame(render)

			x = 0

			analyser.getByteFrequencyData(dataArray)

			ctx.clearRect(0, 0, width, height)

			ctx.lineWidth = STROKE_WIDTH
			ctx.strokeStyle = STROKE_COLOR
			ctx.beginPath()

			for (let i = 0; i < pointsCount; i++) {
				const signalValue = dataArray[i] / 255

				phase += Math.PI / PHASE_SHIFT_FACTOR / (pointsCount - 1)
				const sinArg = (i / (pointsCount - 1)) * Math.PI * 2 * SIN_PERIODS_COUNT + phase
				const sinArg2 = 1.27 * (i / (pointsCount - 1)) * Math.PI * 2 * SIN_PERIODS_COUNT - phase
				const sinArg3 = (i / (pointsCount - 1)) * Math.PI * 2 * SIN_PERIODS_COUNT + phase * 1.331

				const sin = Math.sin(sinArg)
				const cos = Math.cos(sinArg3 * 1.17)
				const sin2 = Math.sin(sinArg2 * 0.73)

				const noise = sin * cos * sin2

				const normalizedY = noise * 0.35 * signalValue + signalValue * 0.65 + Math.random()

				y = (height - normalizedY * height) / 2

				if (i === 0) {
					ctx.moveTo(x, y)
				} else {
					ctx.lineTo(x, y)
				}

				x += segmentWidth
			}
			ctx.stroke()
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
				<canvas className={css.canvas} height="150" width="500" ref={canvasRef} />
			</div>
		</div>
	)
}

export default AudioPlayer
