import css from './Layout.module.scss'
import Header from '../Header/Header.js'
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion'
import { pageAnimation } from '../../lib/animations.js'
import { useTransitionFix } from '../../hooks/useTransitionFix.js'
import { useRouter } from 'next/dist/client/router'
import { usePageTransition } from '../../context/pageTransition.js'

const Layout = ({ children }) => {
	const { isAnimating, setIsAnimating } = usePageTransition()

	const router = useRouter()
	const transitionCallback = useTransitionFix()

	const onAnimationStart = () => setIsAnimating(true)
	const onExitComplete = () => {
		setIsAnimating(false)
		transitionCallback()
	}

	return (
		<div className={css.layout}>
			<Header disabled={isAnimating} />

			<LazyMotion features={domAnimation} strict>
				<AnimatePresence exitBeforeEnter={false} initial={false} onExitComplete={onExitComplete}>
					<m.main
						className={css.wrap}
						key={router.route}
						initial="initial"
						animate="animate"
						exit="exit"
						variants={pageAnimation.variants}
						onAnimationStart={onAnimationStart}
					>
						{children}
					</m.main>
				</AnimatePresence>
			</LazyMotion>
		</div>
	)
}

export default Layout
