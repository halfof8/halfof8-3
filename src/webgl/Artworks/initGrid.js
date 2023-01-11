import { Picture } from '../Picture.js'
import { Grid } from './Grid.js'
import { WheelControls } from '../controls/WheelControls.js'
import { DragControls } from '../controls/DragControls.js'
import { ControlsComposer } from '../controls/ControlsComposer.js'

export const initGrid = ({ renderingContext, geometry, images, PARAMS }) => {
	const gap = 8
	const rowCount = 4
	const columnCount = Math.ceil(images.length / rowCount)
	const pictureAspectRatio = 1.3333
	const cellLookAtZ = 5
	const minOpacity = 0.2

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

	const controls = new ControlsComposer([
		new WheelControls({ elem: renderingContext.canvas, multiplier: 0.5 }),
		new DragControls({ elem: renderingContext.canvas })
	])
	controls.enable()

	const grid = new Grid({
		renderingContext,
		gap,
		size: { x: columnCount, y: rowCount },
		cellSize: pictureSize,
		pictures,
		cellLookAtZ,
		controls,
		minOpacity,
		PARAMS
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
