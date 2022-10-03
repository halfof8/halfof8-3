import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import css from './Navigation.module.scss'
import { cls } from '../../utils/cls.js'

const pages = [
	{ href: '/', name: 'About' },
	{ href: '/artworks', name: 'Artworks' },
	{ href: '/music', name: 'Music' }
]

export default function Navigation() {
	const router = useRouter()

	return (
		<nav className={css.nav}>
			<ul className={css.list}>
				{pages.map((page) => {
					const isActive = router.route === page.href
					return (
						<li className={css.listItem} key={page.href}>
							<Link href={page.href}>
								<a className={cls(css.link, isActive && css.active)}>{page.name}</a>
							</Link>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}
