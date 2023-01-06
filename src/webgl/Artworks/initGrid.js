import { Picture } from '../Picture.js'
import { Grid } from './Grid.js'

export const initGrid = ({ renderingContext, geometry, images, target }) => {
	const gap = 16
	const rowCount = 4
	const columnCount = Math.ceil(images.length / rowCount)
	const pictureAspectRatio = 1.3333

	const pictureSize = getPictureSize()

	const pictures = []
	for (let i = 0; i < rowCount * columnCount; i += 1) {
		const imageIndex = i % images.length
		const image = images[imageIndex]

		const picture = new Picture({ renderingContext })
		picture.setup(image.src, geometry)
		picture.scale.set(pictureSize.x).scale(renderingContext.pxRatio)

		pictures.push(picture)
	}

	const grid = new Grid({
		renderingContext,
		gap,
		size: { x: columnCount, y: rowCount },
		cellSize: pictureSize,
		pictures,
		target
	})

	grid.setParent(renderingContext.scene)

	renderingContext.on('resize', () => {
		const pictureSize = getPictureSize()

		pictures.forEach((picture) => {
			picture.scale.set(pictureSize.x).scale(renderingContext.pxRatio)
		})

		grid.setCellSize(pictureSize)
		grid.resize()
	})

	return grid

	function getPictureSize() {
		const minPictureHeight = window.innerHeight / (rowCount - 1)
		const minPictureWidth = window.innerWidth / (columnCount - 1)
		const pictureHeight = Math.max(minPictureHeight, minPictureWidth * pictureAspectRatio)
		const pictureWidth = pictureHeight / pictureAspectRatio

		return { x: pictureWidth, y: pictureHeight }
	}
}
