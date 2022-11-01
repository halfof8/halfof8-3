import 'swiper/css'
import 'swiper/css/effect-coverflow'
import css from './MusicPage.module.scss'
import AudioPlayer from '../AudioPlayer/AudioPlayer.js'

const MusicPage = ({ tracks }) => {
	return (
		<div className={css.page}>
			<AudioPlayer audioFile={tracks[0].src} background={tracks[0].image} />
		</div>
	)
}

export default MusicPage
