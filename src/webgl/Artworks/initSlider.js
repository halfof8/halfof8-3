import { Slider } from './Slider.js'
import { Picture } from '../Picture.js'
import { ControlsComposer } from '../ControlsComposer.js'
import { DragControls } from '../DragControls.js'

export const initSlider = ({ renderingContext, images, geometry }) => {
	const slider = new Slider({ renderingContext })

	const pictures = images.map((image) => {
		const picture = new Picture({ renderingContext })
		picture.setup(image.src, geometry)
		slider.addSlide(picture)

		return picture
	})

	slider.setParent(renderingContext.scene)
	const controls = new ControlsComposer([new DragControls({ elem: renderingContext.renderer.gl.canvas, ease: 0.15 })])

	const enable = () => {
		controls.enable()
	}
	const disable = () => {
		controls.disable()
	}
	const update = () => {
		controls.update()
		slider.translate.copy(controls.currentPos).scale(renderingContext.pxRatio)
		slider.update()
	}

	return { enable, disable, update, instance: slider }
}
