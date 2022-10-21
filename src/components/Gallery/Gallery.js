import css from './Gallery.module.scss'

export default function Gallery({ images, text }) {
	return (
		<div className={css.gallery}>
			{images.map((image, index) => {
				return (
					<div className={css.card} key={index} style={{ backgroundColor: image.color }}>
						{text}
					</div>
				)
			})}
		</div>
	)
}
