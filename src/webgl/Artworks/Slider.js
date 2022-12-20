import { Transform, Vec2 } from 'ogl'

export class Slider extends Transform {
	constructor({ renderingContext }) {
		super()

		this.renderingContext = renderingContext

		this.translate = new Vec2()

		this.slideWidth = 450
		this.gap = 32
		this.slides = []
	}

	update() {
		this.slides.forEach((slide, index) => {
			const offset = (this.slideWidth + this.gap) * index * this.renderingContext.pxRatio
			slide.position.x = offset + this.translate.x
		})
	}

	addSlide(slide) {
		slide.setParent(this)
		slide.scale.set(this.slideWidth * this.renderingContext.pxRatio)
		slide.position.x = (this.slideWidth + this.gap) * this.slides.length * this.renderingContext.pxRatio
		this.slides.push(slide)
	}
}
