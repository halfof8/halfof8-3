import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion'
import '../styles/index.scss'
import Navigation from '../components/Navigation'
import { animations } from '../lib/animations'

const pages = [
    { href: '/', name: 'Home' },
    { href: '/artworks', name: 'Artworks' },
    { href: '/music', name: 'Music' }
]

function MyApp({ Component, pageProps, router }) {
    const animation = animations[0]

    return (
        <div className="app-wrap">
            <div className="ui-wrap">
                <Navigation pages={pages} />
            </div>
            <LazyMotion features={domAnimation}>
                <AnimatePresence exitBeforeEnter={false} initial={false}>
                    <m.div
                        key={router.route.concat(animation.name)}
                        className="page-wrap"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={animation.variants}
                    >
                        <Component {...pageProps} />
                    </m.div>
                </AnimatePresence>
            </LazyMotion>
        </div>
    )
}

export default MyApp
