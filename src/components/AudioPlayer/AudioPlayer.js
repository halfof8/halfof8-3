import css from './AudioPlayer.module.scss'
import { useEffect, useRef } from 'react'

const AudioPlayer = ({ audioFile }) => {
	const canvasRef = useRef()
	const audioRef = useRef(null)

	const play = () => audioRef.current.play()
	const pause = () => audioRef.current.pause()

	useEffect(() => {
		if (!window?.AudioContext) return

		audioRef.current = new Audio(audioFile)
		const audio = audioRef.current
		audio.crossOrigin = 'anonymous'
		audio.load()

		const ac = new AudioContext()
		const analyser = ac.createAnalyser()
		const sourceNode = ac.createMediaElementSource(audio)

		analyser.fftSize = 2048
		sourceNode.connect(analyser)
		analyser.connect(ac.destination)

		const bufferLength = analyser.frequencyBinCount
		const dataArray = new Uint8Array(bufferLength)

		console.log(bufferLength)

		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		const { width, height } = canvas

		ctx.clearRect(0, 0, width, height)

		let frameId
		const render = () => {
			frameId = requestAnimationFrame(render)

			analyser.getByteTimeDomainData(dataArray)

			ctx.fillStyle = 'rgb(0, 0, 0)'
			ctx.fillRect(0, 0, width, height)

			ctx.lineWidth = 2
			ctx.strokeStyle = '#FAFF00'

			ctx.beginPath()

			const sliceWidth = (width * 1.0) / (bufferLength - 1)
			let x = 0

			for (let i = 0; i < bufferLength; i++) {
				const v = dataArray[i] / 128.0
				const y = (v * height) / 2

				if (i === 0) {
					ctx.moveTo(x, y)
				} else {
					ctx.lineTo(x, y)
				}

				x += sliceWidth
			}

			// ctx.lineTo(width, height / 2)
			ctx.stroke()

			// analyser.getByteFrequencyData(dataArray)
			//
			// ctx.fillStyle = '#000'
			// ctx.fillRect(0, 0, width, height)
			//
			// ctx.lineWidth = 2
			// ctx.strokeStyle = '#FAFF00'
			// ctx.beginPath()
			//
			// const sliceWidth = width / bufferLength
			// let x = 0
			//
			// for (let i = 0; i < bufferLength; i++) {
			// 	const v = dataArray[i] / 128.0
			// 	const y = v * (height / 2)
			//
			// 	if (i === 0) {
			// 		ctx.moveTo(x, y)
			// 	} else {
			// 		ctx.lineTo(x, y)
			// 	}
			//
			// 	x += sliceWidth
			// }
			//
			// ctx.lineTo(width, height / 2)
			// ctx.stroke()
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
