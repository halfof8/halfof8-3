import { Picture } from '../Picture.js'
import { Grid } from './Grid.js'
import { ControlsComposer } from '../ControlsComposer.js'
import { DragControls } from '../DragControls.js'
import { WheelControls } from '../WheelControls.js'
import { ArrowControls } from '../ArrowControls.js'

export const initGrid = ({ renderingContext, geometry, images }) => {
	const gap = 16
	const rowCount = 4
	const columnCount = Math.ceil(images.length / rowCount)
	const pictureAspectRatio = 1.3333
	const ease = 0.05

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
		pictures
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

	const elem = renderingContext.renderer.gl.canvas
	const amount = { x: 50, y: 50 }
	const multiplier = 4
	const controls = new ControlsComposer([
		new DragControls({ elem, ease }),
		new WheelControls({ elem, ease, multiplier }),
		new ArrowControls({ elem: window, ease, amount })
	])

	const enable = () => {
		controls.enable()
	}

	const disable = () => {
		controls.disable()
	}

	const update = () => {
		controls.update()
		grid.translate.copy(controls.currentPos).multiply(renderingContext.pxRatio * 4)
		grid.update()
	}

	return {
		update,
		enable,
		disable
	}

	function getPictureSize() {
		const minPictureHeight = window.innerHeight / (rowCount - 1)
		const minPictureWidth = window.innerWidth / (columnCount - 1)
		const pictureHeight = Math.max(minPictureHeight, minPictureWidth * pictureAspectRatio)
		const pictureWidth = pictureHeight / pictureAspectRatio

		return { x: pictureWidth, y: pictureHeight }
	}
}
