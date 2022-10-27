import MusicPage from '../components/MusicPage/MusicPage.js'

function Music({ audioFiles }) {
	return (
		<>
			<MusicPage audioFiles={audioFiles} />
		</>
	)
}

export default Music

export async function getStaticProps() {
	const audioFiles = [
		{
			src:
				'https://downloads.ctfassets.net' +
				'/4b8maak9frxn/1DdbYrSgOGPQtHC0UoIpWZ' +
				'/591214e50d6088ae4fef21b5c101abaf/2020-02-16_23.16.58.mp3',

			image:
				'https://images.ctfassets.net/4b8maak9frxn/' +
				'7zVVJUPg3S4G0sYE9VGOjD/a1816a14902a11b8533fc8fc282cc51e/8h_audio_kodo.png?w=688&h=916&q=50&fm=png'
		}
	]
	const props = { audioFiles }

	return {
		props
	}
}
