import Gallery from '../components/Gallery/Gallery'
import { m } from 'framer-motion'

const colors = ['#854c4c', '#527548', '#476894', '#9575b9', '#999a90']
const images = Array(32)
    .fill(0)
    .map((_, index) => ({ color: colors[index % colors.length] }))

function artworks() {
    return (
        <div className="artworks">
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.9 } }} exit={{ opacity: 1 }}>
                <Gallery images={images} />
            </m.div>
        </div>
    )
}

export default artworks
