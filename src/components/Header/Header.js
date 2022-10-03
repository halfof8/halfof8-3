import React from 'react'
import Navigation from '../Navigation/Navigation.js'
import css from './Header.module.scss'

const Header = () => {
	return (
		<header className={css.header}>
			<Navigation />
		</header>
	)
}

export default Header
