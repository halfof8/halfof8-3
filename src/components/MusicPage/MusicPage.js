import css from './MusicPage.module.scss'
import AudioPlayer from '../AudioPlayer/AudioPlayer.js'

const MusicPage = ({ audioFiles }) => {
	return (
		<div className={css.page}>
			<AudioPlayer audioFile={audioFiles[0]} />
		</div>
	)
}

export default MusicPage
