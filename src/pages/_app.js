import '../styles/index.scss'
import css from '../styles/App.module.scss'
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion'
import { fadeIn, slideUp } from '../lib/animations'
import Header from '../components/Header/Header.js'
import { useState } from 'react'

function App({ Component, pageProps, router }) {
	const [headerDisabled, setHeaderDisabled] = useState(false)

	return (
		<div className={css.app}>
			<Header disabled={headerDisabled} />

			<LazyMotion features={domAnimation} strict>
				<AnimatePresence exitBeforeEnter={false} initial={false} onExitComplete={() => setHeaderDisabled(false)}>
					<m.div
						className={css.wrap}
						key={router.route}
						initial="initial"
						animate="animate"
						exit="exit"
						variants={slideUp.variants}
						onAnimationStart={() => setHeaderDisabled(true)}
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
