import React from 'react'
import css from './Slider.module.scss'

const Slider = ({ items }) => {
	return (
		<div className={css.slider}>
			<ul className={css.list}>
				{items.map(({ color }, index) => (
					<li className={css.slide} key={index} style={{ backgroundColor: color }} />
				))}
			</ul>
		</div>
	)
}

export default Slider
