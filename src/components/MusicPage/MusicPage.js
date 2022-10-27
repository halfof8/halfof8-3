import css from './MusicPage.module.scss'
import AudioPlayer from '../AudioPlayer/AudioPlayer.js'

const MusicPage = ({ audioFiles }) => {
	return (
		<div className={css.page}>
			<AudioPlayer audioFile={audioFiles[0].src} background={audioFiles[0].image} />
		</div>
	)
}

export default MusicPage
