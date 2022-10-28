import { useCallback, useEffect, useState } from 'react'

export const useAudioControls = (audio) => {
	const [isPlaying, setIsPlaying] = useState(false)

	const play = useCallback(() => {
		audio.play()
		setIsPlaying(true)
	}, [audio])

	const pause = useCallback(() => {
		audio.pause()
		setIsPlaying(false)
	}, [audio])

	const toggle = useCallback(() => {
		if (isPlaying) pause()
		else play()
	}, [play, pause, isPlaying])

	return { play, pause, toggle, isPlaying }
}

export const useAudioAnalyser = (src) => {
	const [audio, setAudio] = useState(null)
	const [analyser, setAnalyser] = useState(null)

	useEffect(() => {
		if (!window) return

		const _audio = new Audio(src)
		setAudio(_audio)

		_audio.crossOrigin = 'anonymous'
		_audio.load()

		const ac = new AudioContext()
		const _analyser = ac.createAnalyser()
		const sourceNode = ac.createMediaElementSource(_audio)

		sourceNode.connect(_analyser)
		_analyser.connect(ac.destination)

		setAnalyser(_analyser)

		return () => setAudio(null)
	}, [src])

	return { audio, analyser }
}
