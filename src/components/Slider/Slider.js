import React from 'react'
import css from './Slider.module.scss'

const Slider = ({ items }) => {
	return (
		<div className={css.slider}>
			<ul className={css.slides}>
				{items.map(({ color }, index) => (
					<li className={css.slide} key={index} style={{ backgroundColor: color }} />
				))}
			</ul>

			<div className={css.controls}>
				<button>Prev</button>
				<button>Next</button>
			</div>
		</div>
	)
}

export default Slider
