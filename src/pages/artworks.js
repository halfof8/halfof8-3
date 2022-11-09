import ArtworksPage from '../components/ArtworksPage/ArtworksPage.js'
import { getAllArtworks } from '../api/artworks.js'

function artworks({ images }) {
	return (
		<>
			<ArtworksPage images={images} />
		</>
	)
}

export default artworks

export async function getStaticProps() {
	const images = await getAllArtworks()
	const props = { images }
	return { props }
}
