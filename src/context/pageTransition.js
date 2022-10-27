import { createContext, useContext, useState } from 'react'

const PageTransitionContext = createContext()

const PageTransitionProvider = ({ children }) => {
	const [isAnimating, setIsAnimating] = useState(false)
	const value = { isAnimating, setIsAnimating }

	return <PageTransitionContext.Provider value={value}>{children}</PageTransitionContext.Provider>
}

const usePageTransition = () => {
	const context = useContext(PageTransitionContext)

	if (!context) {
		throw new Error('usePageTransition must be used within a PageTransitionProvider')
	}

	return context
}

export { PageTransitionProvider, usePageTransition }
