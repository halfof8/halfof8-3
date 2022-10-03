import Slider from '../components/Slider/Slider.js'

const colors = ['#854c4c', '#527548', '#476894', '#9575b9', '#999a90']
const images = Array(16)
	.fill(0)
	.map((_, index) => ({ color: colors[index % colors.length] }))

function Music() {
	return (
		<>
			<Slider items={images} />
		</>
	)
}

export default Music
