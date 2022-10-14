import Slider from '../components/Slider/Slider.js'
import AudioPlayer from '../components/AudioPlayer/AudioPlayer'

const colors = ['#854c4c', '#527548', '#476894', '#9575b9', '#999a90']
const images = Array(16)
	.fill(0)
	.map((_, index) => ({ color: colors[index % colors.length] }))

function Music({ audioFiles }) {
	return (
		<>
			<AudioPlayer audioFile={audioFiles[0]} />
			<Slider items={images} />
		</>
	)
}

export default Music

export async function getStaticProps() {
	// const response = await fetch(`${API_URL}/music/kodo.mp3`)
	// const buffer = await response.arrayBuffer()
	// const waveformData = await waveform(buffer)

	const audioFiles = [
		// eslint-disable-next-line max-len
		'https://assets.ctfassets.net/4b8maak9frxn/3qA87FREaFkNcTftoMB4Su/58ba7683ea23385c76bfd628a582c356/Halfof8___Crush_Tower_v.2.mp3'
	]
	const props = { audioFiles }

	return {
		props
	}
}
