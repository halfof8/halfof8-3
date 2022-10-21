import React from 'react'
import Navigation from '../Navigation/Navigation.js'
import css from './Header.module.scss'

const Header = ({ disabled }) => {
	return (
		<header className={css.header}>
			<Navigation disabled={disabled} />
		</header>
	)
}

export default Header
