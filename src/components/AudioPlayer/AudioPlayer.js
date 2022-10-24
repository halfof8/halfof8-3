import css from './AudioPlayer.module.scss'
import { useCallback, useEffect, useRef, useState } from 'react'
import PlayButton from '../PlayButton/PlayButton.js'
import { m, useAnimationControls } from 'framer-motion'
import { makeLoopWithFpsLimit, makeLoop } from '../../utils/makeLoop.js'

const FPS = 12
const STROKE_WIDTH = 2
const STROKE_COLOR = '#FAFF00'
const FFT_SIZE = 128
const PHASE_SHIFT_FACTOR = 20
const SIN_PERIODS_COUNT = 4
const FREQUENCY_CUTOFF = 0.5

const AudioPlayer = ({ audioFile }) => {
	const canvasRef = useRef(null)
	const audioRef = useRef(null)

	const [isPlaying, setIsPlaying] = useState(false)
	const play = () => audioRef.current.play()
	const pause = () => audioRef.current.pause()
	const toggle = () => {
		if (isPlaying) pause()
		else play()
		setIsPlaying(!isPlaying)
	}

	const progressBarAnimation = useAnimationControls()
	const progressImgAnimation = useAnimationControls()
	const animateProgressControls = useCallback(
		(progress) => {
			const width = constraintsRef.current.width
			const x = progress * width
			const inset = ((width - x) / width) * 100

			progressBarAnimation.start({ x })

			progressImgAnimation.start({
				clipPath: `inset(0 ${inset}% 0 0)`
			})
		},
		[progressBarAnimation, progressImgAnimation]
	)

	const constraintsElementRef = useRef(null)
	const constraintsRef = useRef(null)

	useEffect(() => {
		if (!window) return

		const resizeHandler = () => {
			constraintsRef.current = constraintsElementRef.current.getBoundingClientRect()
		}
		resizeHandler()

		window.addEventListener('resize', resizeHandler)

		return () => {
			window.removeEventListener('resize', resizeHandler)
		}
	}, [])

	const [isDragging, setIsDragging] = useState(false)

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
			analyser.disconnect(ac.destination)
			sourceNode.disconnect(analyser)
			ac.close()
		}
	}, [audioFile])

	useEffect(() => {
		const audio = audioRef.current

		const updateHandler = () => {
			if (isDragging) return
			const progress = audio.currentTime / audio.duration
			if (!isNaN(progress)) animateProgressControls(progress)
		}

		audio.addEventListener('timeupdate', updateHandler)

		return () => {
			audio.removeEventListener('timeupdate', updateHandler)
		}
	}, [animateProgressControls, isDragging])

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

	const getProgress = (x) => {
		const rect = constraintsRef.current
		const progress = (x - rect.left) / rect.width

		if (progress < 0) return 0
		if (progress > 1) return 1
		return progress
	}

	const onPointerDown = (e) => {
		setIsDragging(true)
		const progress = getProgress(e.clientX)
		animateProgressControls(progress)
	}
	const onPointerUp = (e) => {
		setIsDragging(false)
		const progress = getProgress(e.clientX)
		animateProgressControls(progress)
		audioRef.current.currentTime = progress * audioRef.current.duration
	}
	const onPointerMove = (e) => {
		if (!isDragging) return
		const progress = getProgress(e.clientX)
		animateProgressControls(progress)
	}
	const onPointerOut = (e) => {
		if (!isDragging) return
		setIsDragging(false)
		const progress = getProgress(e.clientX)
		animateProgressControls(progress)
	}

	const background =
		'https://images.ctfassets.net/4b8maak9frxn/' +
		'7zVVJUPg3S4G0sYE9VGOjD/a1816a14902a11b8533fc8fc282cc51e/8h_audio_kodo.png?w=688&h=916&q=50&fm=png'

	return (
		<div className={css.root} ref={constraintsElementRef}>
			<m.div className={css.player} animate={animation} transition={{ type: 'spring', mass: 0.1 }}>
				<div className={css.background}>
					<m.img
						animate={progressImgAnimation}
						transition={{ type: 'spring', mass: 0.1 }}
						className={css.backgroundImage}
						src={background}
						alt="background"
					/>
					<img className={css.backgroundImage} src={background} alt="background" />
				</div>

				<div className={css.playButton}>
					<PlayButton onClick={toggle} isPlaying={isPlaying} />
				</div>

				<canvas className={css.canvas} height="100" width="500" ref={canvasRef} />

				<div
					className={css.dragLayer}
					onPointerDown={onPointerDown}
					onPointerUp={onPointerUp}
					onPointerMove={onPointerMove}
					onPointerOut={onPointerOut}
				>
					<m.div
						className={css.progressBar}
						animate={progressBarAnimation}
						transition={{ type: 'spring', mass: 0.1 }}
					/>
				</div>
			</m.div>
		</div>
	)
}

export default AudioPlayer
