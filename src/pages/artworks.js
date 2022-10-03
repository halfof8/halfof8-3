import Gallery from '../components/Gallery/Gallery'

const colors = ['#854c4c', '#527548', '#476894', '#9575b9', '#999a90']
const images = Array(32)
	.fill(0)
	.map((_, index) => ({ color: colors[index % colors.length] }))

function artworks() {
	return (
		<>
			<Gallery images={images} />
		</>
	)
}

export default artworks
