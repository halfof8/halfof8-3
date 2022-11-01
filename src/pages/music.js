import MusicPage from '../components/MusicPage/MusicPage.js'
import { getAllTracks } from '../api/tracks.js'

function Music({ tracks }) {
	return (
		<>
			<MusicPage tracks={tracks} />
		</>
	)
}

export default Music

export async function getStaticProps() {
	const tracks = await getAllTracks()
	const props = { tracks }

	return {
		props
	}
}
