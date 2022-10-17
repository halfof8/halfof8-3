import '../styles/index.scss'
import css from '../styles/App.module.scss'
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion'
import { fadeIn, slideUp } from '../lib/animations'
import Header from '../components/Header/Header.js'

function App({ Component, pageProps, router }) {
	return (
		<div className={css.app}>
			<Header />

			<LazyMotion features={domAnimation}>
				<AnimatePresence exitBeforeEnter={false} initial={false}>
					<m.div
						className={css.wrap}
						key={router.route}
						initial="initial"
						animate="animate"
						exit="exit"
						variants={slideUp.variants}
					>
						<m.main
							className={css.main}
							initial="initial"
							animate="animate"
							exit="exit"
							variants={fadeIn.variants}
						>
							<Component {...pageProps} />
						</m.main>
					</m.div>
				</AnimatePresence>
			</LazyMotion>
		</div>
	)
}

export default App
