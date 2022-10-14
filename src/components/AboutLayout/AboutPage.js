import css from './AboutPage.module.scss'
import { cls } from '../../utils/cls'

const AboutPage = () => {
	return (
		<div className={css.page}>
			<section className={cls(css.column, css.section)}>
				<div className={cls(css.grid, css.block)}>
					<h2 className={css.h1}>
						Designing new products from scratch, with great attention to the UX and the accompanying marketing
						package, is what I do best.
					</h2>
					<p>
						Outlining user journeys, Prioritazing backlog, road mapping, Hosting UX study, Researching a market
						Preparing product releases
					</p>
				</div>

				<p className={css.block}>Highlights from last 5 years of work, sorted latest to earliest, * coming soon</p>

				<div className={css.block}>
					<ul className={css.list}>
						<li className={css.listItem}>* Japan, 100 years of earthquakes</li>
						<li className={css.listItem}>* World Sequencer</li>
						<li className={css.listItem}>Stamps on Yoshida Trail, Mt. Fuji</li>
						<li className={css.listItem}>JetBrains Space</li>
					</ul>
				</div>
			</section>

			<section className={cls(css.column, css.leftSection)}>
				<div className={cls(css.grid, css.block)}>
					<h2 className={cls(css.h1, css.block)}>👋 Hi! I’m Anton</h2>
				</div>
				<div className={cls(css.grid, css.block)}>
					<p className={cls(css.h1, css.block)}>— Product design director with a record of 0-to-1 releases</p>
				</div>
				<div className={cls(css.grid, css.block)}>
					<p className={cls(css.h1, css.block)}>— Artist focusing on narrative with lo-fi 3d</p>
				</div>
				<div className={cls(css.grid, css.block)}>
					<p className={cls(css.h1, css.block)}>— Ambient musician with rare output, about 2 times a year</p>
				</div>
			</section>

			<section className={cls(css.column, css.rightSection)}>
				<div className={cls(css.grid, css.block)}>
					<h2 className={css.h1}>
						Designing new products from scratch, with great attention to the UX and the accompanying marketing
						package, is what I do best.
					</h2>
					<p>
						Outlining user journeys, Prioritazing backlog, road mapping, Hosting UX study, Researching a market
						Preparing product releases
					</p>
				</div>

				<p className={css.block}>Highlights from last 5 years of work, sorted latest to earliest, * coming soon</p>

				<div className={css.block}>
					<ul className={css.list}>
						<li className={css.listItem}>* Japan, 100 years of earthquakes</li>
						<li className={css.listItem}>* World Sequencer</li>
						<li className={css.listItem}>Stamps on Yoshida Trail, Mt. Fuji</li>
						<li className={css.listItem}>JetBrains Space</li>
					</ul>
				</div>
			</section>
		</div>
	)
}

export default AboutPage
