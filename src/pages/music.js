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
		'https://downloads.ctfassets.net' +
			'/4b8maak9frxn/1DdbYrSgOGPQtHC0UoIpWZ' +
			'/591214e50d6088ae4fef21b5c101abaf/2020-02-16_23.16.58.mp3'
	]
	const props = { audioFiles }

	return {
		props
	}
}
