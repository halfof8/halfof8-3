import css from './PlayButton.module.scss'

const PlayButton = ({ isPlaying = false, onClick }) => {
	return (
		<button className={css.button} onClick={onClick}>
			<span className={css.circle}>
				{isPlaying ? (
					<span className={css.pauseIcon} />
				) : (
					<svg className={css.playIcon} xmlns="http://www.w3.org/2000/svg" width="29" height="48" fill="none">
						<path stroke="#FAFF00" strokeWidth="2" d="M27 24L1 3v42l26-21z" />
					</svg>
				)}
			</span>
		</button>
	)
}

export default PlayButton
