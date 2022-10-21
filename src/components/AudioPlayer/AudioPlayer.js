import css from './AudioPlayer.module.scss'
import { useEffect, useRef, useState } from 'react'
import PlayButton from '../PlayButton/PlayButton.js'
import Timeline from '../Timeline/Timeline.js'
import { useAnimationControls, m } from 'framer-motion'

const STROKE_WIDTH = 2
const STROKE_COLOR = '#FAFF00'
const FFT_SIZE = 128
const PHASE_SHIFT_FACTOR = 20
const SIN_PERIODS_COUNT = 4
const FREQUENCY_CUTOFF = 0.5

const AudioPlayer = ({ audioFile }) => {
	const canvasRef = useRef()
	const audioRef = useRef(null)

	const [isPlaying, setIsPlaying] = useState(false)
	const play = () => audioRef.current.play()
	const pause = () => audioRef.current.pause()
	const toggle = () => {
		if (isPlaying) pause()
		else play()
		setIsPlaying(!isPlaying)
	}

	const [progress, setProgress] = useState(0)
	const timelineRef = useRef()
	const onClick = (e) => {
		const rect = timelineRef.current.getBoundingClientRect()
		const value = (e.clientX - rect.left) / rect.width
		const progressToSet = value < 0 ? 0 : value > 1 ? 1 : value
		setProgress(progressToSet)
		audioRef.current.currentTime = progressToSet * audioRef.current.duration
	}

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

				const sin = Math.sin(sinArg)
				const cos = Math.cos(sinArg * 1.17)
				const sin2 = Math.sin(sinArg * 1.37)

				const noise = staticNoise[i]

				const normalizedY = sin * cos * sin2 * 0.3 * signalValue + signalValue * 0.7

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

	useEffect(() => {
		const audio = audioRef.current

		const updateHandler = () => {
			const value = audio.currentTime / audio.duration
			if (!isNaN(value)) setProgress(value)
		}

		audio.addEventListener('timeupdate', updateHandler)

		return () => {
			audio.removeEventListener('timeupdate', updateHandler)
		}
	}, [])

	const animation = useAnimationControls()

	useEffect(() => {
		if (!window) return

		const width = window.innerWidth
		const height = window.innerHeight

		const onMouseMove = (e) => {
			const { clientX, clientY } = e

			const x = ((clientX - width / 2) / width) * 2
			const y = ((clientY - height / 2) / height) * 2

			animation.start({
				rotateX: -y * 15,
				rotateY: x * 15
			})
		}

		window.addEventListener('mousemove', onMouseMove)

		return () => {
			window.removeEventListener('mousemove', onMouseMove)
		}
	}, [animation])

	const background =
		'https://images.ctfassets.net/4b8maak9frxn/' +
		'7zVVJUPg3S4G0sYE9VGOjD/a1816a14902a11b8533fc8fc282cc51e/8h_audio_kodo.png?w=688&h=916&q=50&fm=png'

	return (
		<m.div className={css.player} animate={animation} transition={{ type: 'spring', mass: 0.1 }}>
			<div className={css.background}>
				<img className={css.backgroundImage} src={background} alt="background" />
			</div>

			<div className={css.timeline} onClick={onClick} ref={timelineRef}>
				<Timeline progress={progress} setProgress={setProgress} />
			</div>

			<div className={css.playButton}>
				<PlayButton onClick={toggle} isPlaying={isPlaying} />
			</div>

			<canvas className={css.canvas} height="100" width="500" ref={canvasRef} />
		</m.div>
	)
}

export default AudioPlayer
