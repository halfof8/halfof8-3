import css from './AudioPlayer.module.scss'
import { useCallback, useEffect, useState } from 'react'
import PlayButton from '../PlayButton/PlayButton.js'
import { m, useMotionTemplate, useSpring, useTransform } from 'framer-motion'
import { useAudioAnalyser, useAudioControls } from './useAudio.js'
import { useClientRect } from '../../hooks/useClientRect.js'
import { useMouseTilt } from './useMouseTilt.js'
import { useAudioVisualization } from './useAudioVisualization.js'

const AudioPlayer = ({ audioFile, background }) => {
	console.log('begin')
	const { audio, analyser } = useAudioAnalyser(audioFile)
	const { canvasRef } = useAudioVisualization(analyser)
	const { toggle, isPlaying } = useAudioControls(audio)

	const tiltProps = useMouseTilt({ mass: 0.1 })

	const [rootRect, rootRef] = useClientRect()

	const [isDragging, setIsDragging] = useState(false)

	const progress = useSpring(0, { mass: 0.1 })

	const progressbarXValue = useTransform(progress, [0, 1], [0, rootRect?.width || 0])
	const progressbarX = useMotionTemplate`translate3d(${progressbarXValue}px, 0, 0)`

	const clipPathValue = useTransform(progress, [0, 1], [100, 0])
	const clipPath = useMotionTemplate`inset(0 ${clipPathValue}% 0 0)`

	const animateProgress = useCallback((value) => progress.set(value), [progress])

	useEffect(() => {
		if (!audio) return

		const timeupdateHandler = () => {
			if (isDragging) return
			const audioProgress = audio.currentTime / audio.duration
			if (!isNaN(audioProgress)) animateProgress(audioProgress)
		}

		audio.addEventListener('timeupdate', timeupdateHandler)

		return () => {
			audio.removeEventListener('timeupdate', timeupdateHandler)
		}
	}, [isDragging, audio, animateProgress])

	const getProgress = (x) => {
		const { left = 0, width = 0 } = rootRect
		const progress = (x - left) / width

		if (progress < 0) return 0
		if (progress > 1) return 1
		return progress
	}

	const onPointerDown = (e) => {
		setIsDragging(true)
		const progress = getProgress(e.clientX)
		animateProgress(progress)
	}
	const onPointerUp = (e) => {
		setIsDragging(false)
		const progress = getProgress(e.clientX)
		animateProgress(progress)
		audio.currentTime = progress * audio.duration
	}
	const onPointerMove = (e) => {
		if (!isDragging) return
		const progress = getProgress(e.clientX)
		animateProgress(progress)
	}
	const onPointerOut = (e) => {
		if (!isDragging) return
		setIsDragging(false)
		const progress = getProgress(e.clientX)
		animateProgress(progress)
	}

	return (
		<div className={css.root} ref={rootRef}>
			<m.div className={css.player} {...tiltProps}>
				<div className={css.background}>
					<m.img style={{ clipPath }} className={css.backgroundImage} src={background} alt="background" />
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
					<m.div className={css.progressBar} style={{ transform: progressbarX }} />
				</div>
			</m.div>
		</div>
	)
}

export default AudioPlayer
