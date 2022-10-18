import css from './Timeline.module.scss'

const Timeline = ({ progress = 0 }) => {
	const left = `${progress * 100}%`

	return (
		<div className={css.timeline}>
			<div className={css.progress} style={{ left }} />

			<div className={css.icon} style={{ left }}>
				<div className={css.circle} />
			</div>
		</div>
	)
}

export default Timeline
