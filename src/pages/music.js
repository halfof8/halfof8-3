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
	const audioFiles = [
		'https://downloads.ctfassets.net' +
			'/4b8maak9frxn/1DdbYrSgOGPQtHC0UoIpWZ' +
			'/591214e50d6088ae4fef21b5c101abaf/2020-02-16_23.16.58.mp3'
	]
	const props = { audioFiles }

	return {
		props
	}
}
